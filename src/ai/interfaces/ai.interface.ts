import { Match } from "src/match/interfaces/match.interface";
import { BettingResponse } from "./betting-response.interface";

export interface AiInterface {
    getBettingSuggestions(date: string): Promise<BettingResponse[]>;
    getBettingSuggestionsByMatch(match: Match): Promise<BettingResponse>;
}
