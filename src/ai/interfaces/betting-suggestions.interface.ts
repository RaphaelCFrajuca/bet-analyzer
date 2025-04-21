import { Bet } from "./betting-response.interface";

export interface BettingSuggestions {
    date: Date;
    homeTeam: string;
    awayTeam: string;
    leagueName: string;
    bettingSuggestions: Bet[];
}
