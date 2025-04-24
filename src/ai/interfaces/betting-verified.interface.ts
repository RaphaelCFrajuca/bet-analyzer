interface BetVerified {
    betPredicted: boolean;
    marketName: string;
    bet: string;
}

export interface BettingVerifiedResponse {
    bets: BetVerified[];
}
