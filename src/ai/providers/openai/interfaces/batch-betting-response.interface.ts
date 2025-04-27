import { BettingResponse } from "src/ai/interfaces/betting-response.interface";

export interface BatchBettingResponse {
    matchId: number;
    bettingResponse: BettingResponse;
}
