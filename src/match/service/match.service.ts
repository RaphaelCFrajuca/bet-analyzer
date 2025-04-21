import { Inject, Injectable } from "@nestjs/common";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { EventList } from "src/providers/interfaces/events-list.interface";
import { Market, Match } from "../interfaces/match.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
        private readonly performanceService: PerformanceService,
    ) {}

    async getMatch(day: string): Promise<Match[]> {
        const events: EventList = await this.dataProvider.getEvents(day);

        const matches: Match[] = (await Promise.all(
            events.events
                .filter(event => event.status.code !== 100 && event.status.code !== 60 && event.status.code !== 120)
                .slice(0, 30)
                .map(async event => {
                    const [markets, homeTeamRecentForm, awayTeamRecentForm, lineups, recentDuels] = await Promise.all([
                        this.dataProvider.getMarketOddsByEventId(event.id),
                        this.performanceService.getRecentFormByTeamId(event.homeTeam.id),
                        this.performanceService.getRecentFormByTeamId(event.awayTeam.id),
                        this.dataProvider.getMatchLineupsByEventId(event.id),
                        this.dataProvider.getRecentDuelsByEventId(event.id),
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

                    return {
                        id: event.id,
                        date: new Date(event.startTimestamp * 1000 - 3 * 60 * 60 * 1000),
                        homeTeam: event.homeTeam.name,
                        awayTeam: event.awayTeam.name,
                        actualHomeScore: event.homeScore.current,
                        actualAwayScore: event.awayScore.current,
                        tournament: event.tournament.name,
                        country: event.venue?.country?.name,
                        status: event.status,
                        recentDuels,
                        roundInfo: {
                            round: event.roundInfo?.round,
                        },
                        referee: {
                            id: event.referee?.id,
                            name: event.referee?.name,
                            yellowCards: event.referee?.yellowCards,
                            redCards: event.referee?.redCards,
                            games: event.referee?.games,
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
                }),
        )) as Match[];
        matches.sort((a, b) => a.date.getTime() - b.date.getTime());
        // sort pelo pais Brazil (event->venue->country->name)
        matches.sort((a, b) => {
            if (a.country === "Brazil" && b.country !== "Brazil") {
                return -1;
            } else if (a.country !== "Brazil" && b.country === "Brazil") {
                return 1;
            } else {
                return 0;
            }
        });
        return matches;
    }
}
