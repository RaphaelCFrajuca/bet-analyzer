import { Bet } from "./betting-response.interface";

export interface BettingLeverage {
    bets: Bet[];
    date: Date;
    odd: number;
    confidence: number;
    explanation: string;
    ev: number;
}
