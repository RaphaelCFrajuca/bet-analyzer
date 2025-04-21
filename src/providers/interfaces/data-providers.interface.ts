import { EventStatistics } from "./event-statistics.interface";
import { EventList } from "./events.interface";
import { Lineup } from "./lineup.interface";
import { MarketsResponse } from "./market.interface";
import { RecentDuels } from "./recent-duels.interface";
import { RecentFormResponse } from "./recent-form.interface";

export interface DataProviderInterface {
    getEvents(date: string): Promise<EventList>;
    getMarketOddsByEventId(eventId: number): Promise<MarketsResponse>;
    getRecentPerformanceByTeamId(teamId: number): Promise<RecentFormResponse>;
    getMatchStatisticsByEventId(eventId: number): Promise<EventStatistics>;
    getMatchLineupsByEventId(eventId: number): Promise<Lineup>;
    getRecentDuelsByEventId(eventId: number): Promise<RecentDuels>;
}
