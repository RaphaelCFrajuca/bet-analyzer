import { EventList } from "../sofascore/interfaces/events.interface";

export interface DataProviderInterface {
    getEvents(date: string): Promise<EventList>;
}
