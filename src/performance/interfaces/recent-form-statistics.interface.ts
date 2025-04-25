export interface RecentFormStatistics {
    id: number;
    date: Date;
    homeTeam: string;
    awayTeam: string;
    homeTeamScore: TeamScore;
    awayTeamScore: TeamScore;
    tournament: string;
    ballPossession?: Statistic;
    expectedGoals?: Statistic;
    totalShots?: Statistic;
    goalkeeperSaves?: Statistic;
    cornerKicks?: Statistic;
    fouls?: Statistic;
    passes?: Statistic;
    tackles?: Statistic;
    freeKicks?: Statistic;
    yellowCards?: Statistic;
    redCards?: Statistic;
}

export interface TeamScore {
    total: number;
    firstHalf: number;
    secondHalf: number;
}

export interface Statistic {
    home: string;
    away: string;
}
