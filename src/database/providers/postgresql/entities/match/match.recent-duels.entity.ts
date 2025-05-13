import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RecentDuelsDuelStatsEntity } from "../recent-duels/recent-duels.duel-stats.entity";
import { MatchEntity } from "./match.entity";

@Entity("match_recent-duels")
export class MatchRecentDuelsEntity implements RecentDuels {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => MatchEntity, match => match, { nullable: false })
    match?: MatchEntity;

    @OneToOne(() => RecentDuelsDuelStatsEntity, duelStats => duelStats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    teamDuel: RecentDuelsDuelStatsEntity;

    @OneToOne(() => RecentDuelsDuelStatsEntity, duelStats => duelStats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    managerDuel: RecentDuelsDuelStatsEntity;
}
