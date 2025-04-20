import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { EventList } from "src/providers/sofascore/interfaces/events.interface";
import { MarketsResponse } from "src/providers/sofascore/interfaces/market.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
    ) {}

    async getMatch(day: string): Promise<any> {
        const events: EventList = await this.dataProvider.getEvents(day);

        const matches = Promise.all(
            events.events
                .filter(event => event.status.code !== 100)
                .slice(0, 10)
                .map(async event => {
                    const markets: MarketsResponse = await this.dataProvider.getMarketOddsByEventId(event.id);

                    if (markets.markets.length >= 0) {
                        return {
                            id: event.id,
                            date: new Date(event.startTimestamp * 1000),
                            homeTeam: event.homeTeam.name,
                            awayTeam: event.awayTeam.name,
                            tournament: event.tournament.name,
                            status: event.status,
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
