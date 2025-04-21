import { Inject, Injectable } from "@nestjs/common";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { EventList } from "src/providers/interfaces/events-list.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
        private readonly performanceService: PerformanceService,
    ) {}

    async getMatch(day: string): Promise<any> {
        const events: EventList = await this.dataProvider.getEvents(day);

        const matches = Promise.all(
            events.events
                .filter(event => event.status.code !== 100)
                .slice(0, 10)
                .map(async event => {
                    const [markets, homeTeamRecentForm, awayTeamRecentForm, lineups, recentDuels] = await Promise.all([
                        this.dataProvider.getMarketOddsByEventId(event.id),
                        this.performanceService.getRecentFormByTeamId(event.homeTeam.id),
                        this.performanceService.getRecentFormByTeamId(event.awayTeam.id),
                        this.dataProvider.getMatchLineupsByEventId(event.id),
                        this.dataProvider.getRecentDuelsByEventId(event.id),
                    ]);

                    if (markets.markets.length >= 0) {
                        return {
                            id: event.id,
                            date: new Date(event.startTimestamp * 1000),
                            homeTeam: event.homeTeam.name,
                            awayTeam: event.awayTeam.name,
                            tournament: event.tournament.name,
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
                            markets: markets.markets.map(market => ({
                                marketId: market.marketId,
                                marketName: market.marketName,
                                choiceGroup: market?.choiceGroup,
                                choices: market.choices.map(choice => ({
                                    name: choice.name,
                                    initialOddValue: choice.initialFractionalValue,
                                    oddValue: choice.fractionalValue,
                                    slipContent: choice.slipContent,
                                    change: choice.change,
                                })),
                            })),
                        };
                    }
                }),
        );
        return matches;
    }
}
