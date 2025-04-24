import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisConfig } from "src/ai/providers/openai/interfaces/redis.config.interface";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { Event, EventList } from "src/providers/interfaces/events-list.interface";
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
            return JSON.parse(cachedMatches) as Match[];
        }
        console.log(`Cache miss for date: ${day}`);

        const events: EventList = await this.dataProvider.getEvents(day);

        const matches: Match[] = await Promise.all(
            events.events
                .filter(event => event.status.code !== 100 && event.status.code !== 60 && event.status.code !== 120)
                .slice(0, 15)
                .map(async event => {
                    return this.getMatchByEvent(event, live);
                }),
        );
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

        await this.redis.set(`matches_${day}`, JSON.stringify(matches), "EX", 86400);
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
            this.performanceService.getMatchStatisticsByEventId(event),
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
        };
        await this.redis.set(`match_${event.id}`, JSON.stringify(match), "EX", 86400);
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
        await this.redis.set(`match_${eventId}`, JSON.stringify(match), "EX", 86400);
        return match;
    }

    async getTeamImage(teamId: number): Promise<Buffer> {
        const teamImage = await this.dataProvider.getTeamImageByTeamId(teamId);
        return teamImage;
    }
}
