export interface RecentDuels {
    teamDuel: DuelStats;
    managerDuel: DuelStats;
}

export interface DuelStats {
    homeWins: number;
    awayWins: number;
    draws: number;
}
