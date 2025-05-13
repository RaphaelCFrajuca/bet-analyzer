import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisConfig } from "src/ai/providers/openai/interfaces/redis.config.interface";
import { Database } from "src/database/providers/interfaces/database.interface";
import { MatchEntity } from "src/database/providers/postgresql/entities/match/match.entity";
import { MatchStatsEntity } from "src/database/providers/postgresql/entities/match/match.stats.entity";
import { TeamEntity } from "src/database/providers/postgresql/entities/team/team.entity";
import { TeamRecentFormEntity } from "src/database/providers/postgresql/entities/team/team.recent-form.entity";
import { RecentFormStatistics } from "src/performance/interfaces/recent-form-statistics.interface";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { Event, EventList } from "src/providers/interfaces/events-list.interface";
import { Lineup } from "src/providers/interfaces/lineup.interface";
import { MarketsResponse } from "src/providers/interfaces/market.interface";
import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Market, Match } from "../interfaces/match.interface";

@Injectable()
export class MatchService {
    private redis: Redis;

    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
        private readonly performanceService: PerformanceService,
        @Inject("REDIS_CONFIG")
        private readonly redisConfig: RedisConfig,
        @Inject("DATABASE_PROVIDER") private readonly databaseProvider: Database,
    ) {
        this.redis = new Redis({
            host: this.redisConfig.host,
            port: this.redisConfig.port,
            password: this.redisConfig.password,
            username: this.redisConfig.user,
        });
    }

    async getMatch(day: string, live: boolean): Promise<Match[]> {
        const cachedMatches = await this.redis.get(`matches_${day}`);
        if (cachedMatches && !live) {
            console.log(`Cache hit for date: ${day}`);
            console.log("Getting matches...");
            const matchesIds = JSON.parse(cachedMatches) as number[];
            console.log(`Matches ids length: ${matchesIds.length}`);
            const matches: Match[] = await Promise.all(
                matchesIds.map(async matchId => {
                    const cachedMatch = (await this.redis.get(`match_${matchId}`)) as string;
                    return JSON.parse(cachedMatch) as Match;
                }),
            );
            return matches;
        }
        console.log(`Cache miss for date: ${day}`);

        const events: EventList = await this.dataProvider.getEvents(day);
        console.log(`Events length: ${events.events.length}`);

        const matches: Match[] = await Promise.all(
            events.events
                .filter(event => event.status.code !== 100 && event.status.code !== 60 && event.status.code !== 120)
                .slice(0, 15)
                .map(async event => {
                    return this.getMatchByEvent(event, live);
                }),
        );

        matches.forEach(match => {
            console.log(`Match: ${match.homeTeam} vs ${match.awayTeam} - Event ID: ${match.id}`);
        });

        console.log(`Matches length: ${matches.length}`);
        matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        matches.sort((a, b) => {
            if (a.country === "Brazil" && b.country !== "Brazil") {
                return -1;
            } else if (a.country !== "Brazil" && b.country === "Brazil") {
                return 1;
            } else {
                return 0;
            }
        });
        console.log(`Sorted matches length: ${matches.length}`);
        const matchesIdsToCache = matches.map(match => match.id);
        await this.redis.set(`matches_${day}`, JSON.stringify(matchesIdsToCache), "EX", 604800);

        return matches;
    }

    async getMatchByEvent(event: Event, live: boolean): Promise<Match> {
        const cachedMatch = await this.redis.get(`match_${event.id}`);
        if (cachedMatch && !live) {
            console.log(`Cache hit for event.id: ${event.id}`);
            return JSON.parse(cachedMatch) as Match;
        }
        console.log(`Cache miss for event id: ${event.id}`);

        const [markets, homeTeamRecentForm, awayTeamRecentForm, lineups, recentDuels, actualMatchStatistics] = await Promise.all([
            this.dataProvider.getMarketOddsByEventId(event.id),
            this.performanceService.getRecentFormByTeamId(event.homeTeam.id),
            this.performanceService.getRecentFormByTeamId(event.awayTeam.id),
            this.dataProvider.getMatchLineupsByEventId(event.id),
            this.dataProvider.getRecentDuelsByEventId(event.id),
            this.performanceService.getMatchStatisticsByEvent(event),
        ]);

        const marketsList: Market[] = markets?.markets?.map(market => ({
            marketId: market.marketId,
            marketName: market.marketName,
            choiceGroup: market?.choiceGroup,
            choices: market.choices.map(choice => ({
                name: choice.name,
                initialOddValue: String(choice.initialFractionalValue),
                oddValue: String(choice.fractionalValue),
                slipContent: choice.slipContent,
                change: choice.change,
            })),
        }));

        const match = {
            id: event.id,
            date: new Date(event.startTimestamp * 1000),
            homeTeam: event.homeTeam.name,
            homeTeamId: event.homeTeam.id,
            awayTeam: event.awayTeam.name,
            awayTeamId: event.awayTeam.id,
            actualHomeScore: event?.homeScore?.current,
            actualAwayScore: event?.awayScore?.current,
            tournament: event.tournament.name,
            actualMatchStatistics,
            country: event.venue?.country?.name,
            status: event.status,
            recentDuels,
            roundInfo: {
                round: event.roundInfo?.round,
            },
            referee: {
                id: event?.referee?.id,
                name: event?.referee?.name,
                yellowCards: event?.referee?.yellowCards,
                redCards: event?.referee?.redCards,
                games: event?.referee?.games,
            },
            lineups: {
                confirmed: lineups?.confirmed,
                homeTeam: {
                    formation: lineups?.home?.formation,
                    players: lineups?.home?.players?.map(player => ({
                        avgRating: player?.avgRating,
                        id: player?.player?.id,
                        name: player?.player?.name,
                        jerseyNumber: player?.jerseyNumber,
                        position: player?.position,
                        substitute: player?.substitute,
                    })),
                    missingPlayers: lineups?.home?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer?.player?.id,
                        name: missingPlayer?.player?.name,
                        jerseyNumber: missingPlayer?.player?.jerseyNumber,
                        position: missingPlayer?.player?.position,
                    })),
                },
                awayTeam: {
                    formation: lineups?.away?.formation,
                    players: lineups?.away?.players?.map(player => ({
                        avgRating: player?.avgRating,
                        id: player?.player?.id,
                        name: player?.player?.name,
                        jerseyNumber: player?.jerseyNumber,
                        position: player?.position,
                        substitute: player?.substitute,
                    })),
                    missingPlayers: lineups?.away?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer?.player?.id,
                        name: missingPlayer?.player?.name,
                        jerseyNumber: missingPlayer?.player?.jerseyNumber,
                        position: missingPlayer?.player?.position,
                    })),
                },
            },
            homeTeamPerformance: {
                homeTeamRecentForm,
            },
            awayTeamPerformance: {
                awayTeamRecentForm,
            },
            markets: marketsList,
            surebets: (await this.verifySureBets(event)) || [],
        };
        await this.redis.set(`match_${event.id}`, JSON.stringify(match), "EX", 259200);

        // try {
        //     const matchEntity: MatchEntity = this.createMatchEntity(event, homeTeamRecentForm, awayTeamRecentForm, actualMatchStatistics, recentDuels, lineups, marketsList);
        //     await this.databaseProvider.createMatch(matchEntity);
        // } catch (error: unknown) {
        //     console.error("Error creating match entity:", error);
        //     const errorMessage = error instanceof Error ? `${error.message}, ${match.id}` : "Unknown error";
        //     throw new InternalServerErrorException("Error creating match entity", errorMessage);
        // }

        return match;
    }

    private createMatchEntity(
        event: Event,
        homeTeamRecentForm: RecentFormStatistics[],
        awayTeamRecentForm: RecentFormStatistics[],
        actualMatchStatistics: RecentFormStatistics,
        recentDuels: RecentDuels,
        lineups: Lineup,
        marketsList: Market[],
    ): MatchEntity {
        const mapRecentForm = (teamId: number, statsList: RecentFormStatistics[]): TeamRecentFormEntity[] => {
            return statsList.map(stat => {
                const stats: MatchStatsEntity = {
                    ...stat,
                    general: {
                        ballPossession: stat.ballPossession,
                        cornerKicks: stat.cornerKicks,
                        expectedGoals: stat.expectedGoals,
                        fouls: stat.fouls,
                        freeKicks: stat.freeKicks,
                        goalkeeperSaves: stat.goalkeeperSaves,
                        passes: stat.passes,
                        redCards: stat.redCards,
                        tackles: stat.tackles,
                        totalShots: stat.totalShots,
                        yellowCards: stat.yellowCards,
                        matchStats: {} as MatchStatsEntity,
                    },
                    detailed: {
                        attack: stat.attack,
                        defending: stat.defending,
                        duels: stat.duels,
                        goalkeeping: stat.goalkeeping,
                        passesDetails: stat.passesDetails,
                        shots: stat.shots,
                        matchStats: {} as MatchStatsEntity,
                    },
                };

                if (stats.general) stats.general.matchStats = stats;
                if (stats.detailed) stats.detailed.matchStats = stats;

                return {
                    team: { id: teamId } as TeamEntity,
                    stats,
                };
            });
        };

        const actualStats: MatchStatsEntity = {
            ...actualMatchStatistics,
            general: {
                ballPossession: actualMatchStatistics.ballPossession,
                cornerKicks: actualMatchStatistics.cornerKicks,
                expectedGoals: actualMatchStatistics.expectedGoals,
                fouls: actualMatchStatistics.fouls,
                freeKicks: actualMatchStatistics.freeKicks,
                goalkeeperSaves: actualMatchStatistics.goalkeeperSaves,
                passes: actualMatchStatistics.passes,
                redCards: actualMatchStatistics.redCards,
                tackles: actualMatchStatistics.tackles,
                totalShots: actualMatchStatistics.totalShots,
                yellowCards: actualMatchStatistics.yellowCards,
                matchStats: {} as MatchStatsEntity,
            },
            detailed: {
                attack: actualMatchStatistics.attack,
                defending: actualMatchStatistics.defending,
                duels: actualMatchStatistics.duels,
                goalkeeping: actualMatchStatistics.goalkeeping,
                passesDetails: actualMatchStatistics.passesDetails,
                shots: actualMatchStatistics.shots,
                matchStats: {} as MatchStatsEntity,
            },
        };

        if (actualStats.general) actualStats.general.matchStats = actualStats;
        if (actualStats.detailed) actualStats.detailed.matchStats = actualStats;

        return {
            id: event.id,
            date: new Date(event.startTimestamp * 1000),
            homeTeam: {
                id: event.homeTeam.id,
                name: event.homeTeam.name,
                recentForm: mapRecentForm(event.homeTeam.id, homeTeamRecentForm),
            },
            awayTeam: {
                id: event.awayTeam.id,
                name: event.awayTeam.name,
                recentForm: mapRecentForm(event.awayTeam.id, awayTeamRecentForm),
            },
            actualHomeScore: event?.homeScore?.current,
            actualAwayScore: event?.awayScore?.current,
            tournament: event.tournament.name,
            matchStatistics: actualStats,
            country: event.venue?.country?.name,
            status: {
                code: event.status.code,
                description: event.status.description,
                type: event.status.type,
            },
            recentDuels,
            roundNumber: event.roundInfo?.round,
            referee: {
                id: event?.referee?.id,
                name: event?.referee?.name,
                yellowCards: event?.referee?.yellowCards,
                yellowRedCards: event?.referee?.yellowRedCards,
                slug: event?.referee?.slug,
                redCards: event?.referee?.redCards,
                games: event?.referee?.games,
                country: event.referee?.country,
            },
            lineups: {
                confirmed: lineups?.confirmed,
                home: {
                    formation: lineups?.home?.formation,
                    players: lineups?.home?.players?.map(player => ({
                        avgRating: player?.avgRating,
                        id: player?.player?.id,
                        name: player?.player?.name,
                        jerseyNumber: player?.jerseyNumber,
                        position: player?.position,
                        substitute: player?.substitute,
                        teamId: player?.teamId,
                        shirtNumber: player?.shirtNumber,
                    })),
                    missingPlayers: lineups?.home?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer?.player?.id,
                        name: missingPlayer?.player?.name,
                        jerseyNumber: missingPlayer?.player?.jerseyNumber,
                        position: missingPlayer?.player?.position,
                        type: missingPlayer?.type,
                        reason: missingPlayer?.reason,
                    })),
                },
                away: {
                    formation: lineups?.away?.formation,
                    players: lineups?.away?.players?.map(player => ({
                        avgRating: player?.avgRating,
                        id: player?.player?.id,
                        name: player?.player?.name,
                        jerseyNumber: player?.jerseyNumber,
                        position: player?.position,
                        substitute: player?.substitute,
                        teamId: player?.teamId,
                        shirtNumber: player?.shirtNumber,
                    })),
                    missingPlayers: lineups?.away?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer?.player?.id,
                        name: missingPlayer?.player?.name,
                        jerseyNumber: missingPlayer?.player?.jerseyNumber,
                        position: missingPlayer?.player?.position,
                        type: missingPlayer?.type,
                        reason: missingPlayer?.reason,
                    })),
                },
            },
            markets: marketsList,
        };
    }

    private convertMatchEntityToMatch(matchEntity: MatchEntity): Match {
        return {
            id: matchEntity.id,
            date: matchEntity.date,
            homeTeam: matchEntity.homeTeam.name,
            homeTeamId: matchEntity.homeTeam.id,
            awayTeam: matchEntity.awayTeam.name,
            awayTeamId: matchEntity.awayTeam.id,
            actualHomeScore: matchEntity.actualHomeScore,
            actualAwayScore: matchEntity.actualAwayScore,
            tournament: matchEntity.tournament,
            actualMatchStatistics: matchEntity.matchStatistics
                ? {
                      ...matchEntity.matchStatistics,
                      id: matchEntity.matchStatistics.id,
                      homeTeam: matchEntity.homeTeam.name,
                      awayTeam: matchEntity.awayTeam.name,
                  }
                : undefined,
            country: matchEntity.country,
            status: matchEntity.status,
            recentDuels: matchEntity.recentDuels,
            roundInfo: {
                round: matchEntity.roundNumber,
            },
            referee: {
                id: matchEntity.referee?.id,
                name: matchEntity.referee?.name,
                yellowCards: matchEntity.referee?.yellowCards,
                redCards: matchEntity.referee?.redCards,
                games: matchEntity.referee?.games,
            },
            lineups: {
                confirmed: matchEntity.lineups?.confirmed,
                homeTeam: {
                    formation: matchEntity.lineups?.home?.formation,
                    players: matchEntity.lineups?.home?.players?.map(player => ({
                        avgRating: player.avgRating,
                        id: player.id,
                        name: player.name,
                        jerseyNumber: player.jerseyNumber,
                        position: player.position,
                        substitute: player.substitute,
                    })),
                    missingPlayers: matchEntity.lineups?.home?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer.id,
                        name: missingPlayer.name,
                        jerseyNumber: missingPlayer.jerseyNumber,
                        position: missingPlayer.position,
                    })),
                },
                awayTeam: {
                    formation: matchEntity.lineups?.away?.formation,
                    players: matchEntity.lineups?.away?.players?.map(player => ({
                        avgRating: player.avgRating,
                        id: player.id,
                        name: player.name,
                        jerseyNumber: player.jerseyNumber,
                        position: player.position,
                        substitute: player.substitute,
                    })),
                    missingPlayers: matchEntity.lineups?.away?.missingPlayers?.map(missingPlayer => ({
                        id: missingPlayer.id,
                        name: missingPlayer.name,
                        jerseyNumber: missingPlayer.jerseyNumber,
                        position: missingPlayer.position,
                    })),
                },
            },
            homeTeamPerformance: {
                homeTeamRecentForm: matchEntity.homeTeam.recentForm.map(form => {
                    return {
                        ...form.stats,
                        id: form.stats.id,
                        homeTeam: matchEntity.homeTeam.name,
                        awayTeam: matchEntity.awayTeam.name,
                    };
                }),
            },
            awayTeamPerformance: {
                awayTeamRecentForm: matchEntity.awayTeam.recentForm.map(form => {
                    return {
                        ...form.stats,
                        id: form.stats.id,
                        homeTeam: matchEntity.homeTeam.name,
                        awayTeam: matchEntity.awayTeam.name,
                    };
                }),
            },
            markets: matchEntity.markets,
            surebets: [], // Adicione lógica para preencher surebets, se necessário
        };
    }

    async getMatchByEventId(eventId: number, live: boolean): Promise<Match> {
        const cachedMatch = await this.redis.get(`match_${eventId}`);
        if (cachedMatch && !live) {
            console.log(`Cache hit for eventId: ${eventId}`);
            // const matchEntity = await this.databaseProvider.getMatchById(eventId);
            // if (matchEntity) {
            //     console.log(`MatchEntity found for event.id: ${eventId}`);
            //     return this.convertMatchEntityToMatch(matchEntity);
            // } else {
            //     console.log(`MatchEntity not found for event.id: ${eventId}`);
            // }
            return JSON.parse(cachedMatch) as Match;
        }
        console.log(`Cache miss for eventId: ${eventId}`);

        const event: Event = await this.dataProvider.getEventByEventId(eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        const match = await this.getMatchByEvent(event, live);
        await this.redis.set(`match_${eventId}`, JSON.stringify(match), "EX", 259200);
        return match;
    }

    async getTeamImage(teamId: number): Promise<Buffer> {
        const teamImage = await this.dataProvider.getTeamImageByTeamId(teamId);
        return teamImage;
    }

    async verifySureBets(event: Event): Promise<SureBet[] | false> {
        const marketsBet365: MarketsResponse = await this.dataProvider.getMarketOddsByEventId(event.id, 1);
        const marketsBetano: MarketsResponse = await this.dataProvider.getMarketOddsByEventId(event.id, 100);

        if (!marketsBet365 || !marketsBetano) {
            return false;
        }

        const surebetsResults: SureBet[] = [];

        if (!marketsBet365.markets || !marketsBetano.markets) {
            return false;
        }

        for (const bet365Market of marketsBet365.markets) {
            const betanoMarket = marketsBetano?.markets?.find(market => market.marketName === bet365Market.marketName && market.choiceGroup === bet365Market.choiceGroup);

            if (!betanoMarket) continue;

            const combinedChoices: { [name: string]: { odd: number; casa: string } } = {};

            for (const choice of bet365Market.choices) {
                combinedChoices[choice.name] = {
                    odd: Number(choice.fractionalValue),
                    casa: "Bet365",
                };
            }

            for (const choice of betanoMarket.choices) {
                const existing = combinedChoices[choice.name];
                const odd = Number(choice.fractionalValue);

                if (!existing || odd > existing.odd) {
                    combinedChoices[choice.name] = {
                        odd,
                        casa: "Betano",
                    };
                }
            }

            const choiceEntries = Object.entries(combinedChoices);

            if (choiceEntries.length !== 2) continue;

            const [choiceA, dataA] = choiceEntries[0];
            const [choiceB, dataB] = choiceEntries[1];

            const areOpposites =
                (choiceA.toLowerCase() === "over" && choiceB.toLowerCase() === "under") ||
                (choiceA.toLowerCase() === "under" && choiceB.toLowerCase() === "over") ||
                (choiceA === "1" && choiceB === "2") ||
                (choiceA === "2" && choiceB === "1") ||
                (choiceA === "Yes" && choiceB === "No") ||
                (choiceA === "No" && choiceB === "Yes");

            const casasDiferentes = dataA.casa !== dataB.casa;

            if (!areOpposites || !casasDiferentes) continue;

            const soma = 1 / dataA.odd + 1 / dataB.odd;

            if (soma < 1) {
                const lucroPercentual = Number(((1 - soma) * 100).toFixed(2));
                surebetsResults.push({
                    marketName: bet365Market.marketName,
                    lucroPercentual,
                    oddsUsadas: [
                        { choice: choiceA, odd: dataA.odd, casa: dataA.casa },
                        { choice: choiceB, odd: dataB.odd, casa: dataB.casa },
                    ],
                });
            }
        }

        return surebetsResults.length > 0 ? surebetsResults : false;
    }
}

export interface SureBet {
    marketName: string;
    lucroPercentual: number;
    oddsUsadas: { choice: string; odd: number; casa: string }[];
}
