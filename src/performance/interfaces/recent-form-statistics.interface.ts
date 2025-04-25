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
    shots?: {
        totalShots?: Statistic;
        shotsOnTarget?: Statistic;
        hitWoodwork?: Statistic;
        shotsOffTarget?: Statistic;
        blockedShots?: Statistic;
        shotsInsideBox?: Statistic;
        shotsOutsideBox?: Statistic;
    };
    attack?: {
        bigChancesScored?: Statistic;
        bigChancesMissed?: Statistic;
        throughBalls?: Statistic;
        touchesInPenaltyArea?: Statistic;
        fouledInFinalThird?: Statistic;
        offsides?: Statistic;
    };
    passesDetails?: {
        accuratePasses?: Statistic;
        throwIns?: Statistic;
        finalThirdEntries?: Statistic;
        finalThirdPhase?: Statistic;
        longBalls?: Statistic;
        crosses?: Statistic;
    };
    duels?: {
        duels?: Statistic;
        dispossessed?: Statistic;
        groundDuels?: Statistic;
        aerialDuels?: Statistic;
        dribbles?: Statistic;
    };
    defending?: {
        tacklesWon?: Statistic;
        totalTackles?: Statistic;
        interceptions?: Statistic;
        recoveries?: Statistic;
        clearances?: Statistic;
        errorsLeadingToShot?: Statistic;
        errorsLeadingToGoal?: Statistic;
    };
    goalkeeping?: {
        totalSaves?: Statistic;
        goalsPrevented?: Statistic;
        bigSaves?: Statistic;
        punches?: Statistic;
        goalKicks?: Statistic;
    };
}

export interface TeamScore {
    total: number;
    firstHalf: number;
    secondHalf: number;
}

export interface Statistic {
    home: string;
    away: string;
    statisticsType?: string;
}
