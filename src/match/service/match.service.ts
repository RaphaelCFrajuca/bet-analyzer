import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { EventList } from "src/providers/sofascore/interfaces/events.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
    ) {}

    async getMatch(day: string): Promise<any> {
        const events: EventList = await this.dataProvider.getEvents(day);
        const matches = events.events
            .filter(event => event.status.code !== 100)
            .map(event => {
                return {
                    id: event.id,
                    date: new Date(event.startTimestamp * 1000),
                    homeTeam: event.homeTeam.name,
                    awayTeam: event.awayTeam.name,
                    tournament: event.tournament.name,
                    status: event.status,
                };
            });
        return matches;
    }
}
