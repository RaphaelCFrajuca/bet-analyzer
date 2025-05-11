import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RecentDuelsDuelStatsEntity } from "../recent-duels/recent-duels.duel-stats.entity";

@Entity("match_recent-duels")
export class MatchRecentDuelsEntity implements RecentDuels {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => RecentDuelsDuelStatsEntity, duelStats => duelStats, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    teamDuel: RecentDuelsDuelStatsEntity;

    @OneToOne(() => RecentDuelsDuelStatsEntity, duelStats => duelStats, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    managerDuel: RecentDuelsDuelStatsEntity;
}
