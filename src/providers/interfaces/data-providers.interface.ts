import { EventStatistics } from "../sofascore/interfaces/event-statistics.interface";
import { EventList } from "../sofascore/interfaces/events.interface";
import { MarketsResponse } from "../sofascore/interfaces/market.interface";
import { RecentFormResponse } from "../sofascore/interfaces/recent-form.interface";

export interface DataProviderInterface {
    getEvents(date: string): Promise<EventList>;
    getMarketOddsByEventId(eventId: number): Promise<MarketsResponse>;
    getRecentPerformanceByTeamId(teamId: number): Promise<RecentFormResponse>;
    getMatchStatisticsByEventId(eventId: number): Promise<EventStatistics>;
}
