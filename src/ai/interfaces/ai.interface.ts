import { Match } from "src/match/interfaces/match.interface";
import { BettingResponse } from "./betting-response.interface";
import { BettingSuggestions } from "./betting-suggestions.interface";

export interface AiInterface {
    getBettingSuggestions(date: string): Promise<BettingSuggestions[]>;
    getBettingSuggestionsByMatch(match: Match): Promise<BettingResponse>;
    getBettingSuggestionsByEventId(eventId: number): Promise<BettingResponse>;
}
