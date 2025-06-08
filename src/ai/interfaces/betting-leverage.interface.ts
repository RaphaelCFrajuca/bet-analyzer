import { BettingSuggestions } from "./betting-suggestions.interface";

export interface BettingLeverage {
    bets: BettingSuggestions[];
    date: Date;
    odd: number;
    confidence: number;
    explanation: string;
    ev: number;
}
