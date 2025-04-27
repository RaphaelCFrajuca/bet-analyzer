import { Match } from "src/match/interfaces/match.interface";
import { BettingResponse } from "./betting-response.interface";
import { BettingSuggestions } from "./betting-suggestions.interface";
import { BettingVerifiedResponse } from "./betting-verified.interface";

export interface AiInterface {
    getBettingSuggestions(date: string, live: boolean): Promise<BettingSuggestions[]>;
    getBettingSuggestionsByMatch(match: Match, live: boolean): Promise<BettingResponse>;
    getBettingSuggestionsByEventId(eventId: number, live: boolean): Promise<BettingResponse>;
    getBettingVerifiedByEventId(eventId: number, live: boolean): Promise<BettingVerifiedResponse>;
    syncBettingSuggestionsByMatch(matches: Match[]): Promise<void>;
    verifySync(): Promise<Match[]>;
}
