import { EventList } from "../sofascore/interfaces/events.interface";
import { MarketsResponse } from "../sofascore/interfaces/market.interface";

export interface DataProviderInterface {
    getEvents(date: string): Promise<EventList>;
    getMarketOddsByEventId(eventId: number): Promise<MarketsResponse>;
}
