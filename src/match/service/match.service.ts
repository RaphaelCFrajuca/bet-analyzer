import { Inject, Injectable } from "@nestjs/common";
import { PerformanceService } from "src/performance/services/performance.service";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { EventList } from "src/providers/sofascore/interfaces/events.interface";

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
                    // const [markets, homeTeamRecentForm, awayTeamRecentForm] = await Promise.all([
                    //     this.dataProvider.getMarketOddsByEventId(event.id),
                    //     this.performanceService.getRecentFormByTeamId(event.homeTeam.id),
                    //     this.performanceService.getRecentFormByTeamId(event.awayTeam.id),
                    // ]);
                    const markets = await this.dataProvider.getMarketOddsByEventId(event.id);
                    const homeTeamRecentForm = await this.performanceService.getRecentFormByTeamId(event.homeTeam.id);
                    const awayTeamRecentForm = await this.performanceService.getRecentFormByTeamId(event.awayTeam.id);
                    if (markets.markets.length >= 0) {
                        return {
                            id: event.id,
                            date: new Date(event.startTimestamp * 1000),
                            homeTeam: event.homeTeam.name,
                            awayTeam: event.awayTeam.name,
                            tournament: event.tournament.name,
                            status: event.status,
                            homeTeamPerformance: {
                                homeTeamRecentForm,
                            },
                            awayTeamPerformance: {
                                awayTeamRecentForm,
                            },
                            markets: markets.markets.map(market => ({
                                marketId: market.marketId,
                                marketName: market.marketName,
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
