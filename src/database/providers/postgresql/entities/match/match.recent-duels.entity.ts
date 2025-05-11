import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Entity } from "typeorm";
import { RecentDuelsDuelStatsEntity } from "../recent-duels/recent-duels.duel-stats.entity";

@Entity("match_recent-duels")
export class MatchRecentDuelsEntity implements RecentDuels {
    teamDuel: RecentDuelsDuelStatsEntity;
    managerDuel: RecentDuelsDuelStatsEntity;
}
