export interface RecentFormStatistics {
    id: number;
    date: Date;
    homeTeam: string;
    awayTeam: string;
    tournament: string;
    ballPossession: Statistic;
    expectedGoals: Statistic;
    totalShots: Statistic;
    goalkeeperSaves: Statistic;
    cornerKicks: Statistic;
    fouls: Statistic;
    passes: Statistic;
    tackles: Statistic;
    freeKicks: Statistic;
    yellowCards: Statistic;
    redCards: Statistic;
}

export interface Statistic {
    home: number | string;
    away: number | string;
}
