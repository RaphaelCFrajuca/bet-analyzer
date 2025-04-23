interface BetVerified {
    success: boolean;
    marketName: string;
    bet: string;
}

export interface BettingVerifiedResponse {
    bets: BetVerified[];
}
