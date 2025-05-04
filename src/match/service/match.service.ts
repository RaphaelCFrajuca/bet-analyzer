import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisConfig } from "src/ai/providers/openai/interfaces/redis.config.interface";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { Event, EventList } from "src/providers/interfaces/events-list.interface";
import { MarketsResponse } from "src/providers/interfaces/market.interface";
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
        return match;
    }

    async getMatchByEventId(eventId: number, live: boolean): Promise<Match> {
        const cachedMatch = await this.redis.get(`match_${eventId}`);
        if (cachedMatch && !live) {
            console.log(`Cache hit for eventId: ${eventId}`);
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
