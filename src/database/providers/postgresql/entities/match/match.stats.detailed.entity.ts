import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsAttackEntity } from "../stats/stats.attack.entity";
import { StatsDefendingEntity } from "../stats/stats.defending.entity";
import { StatsDuelsEntity } from "../stats/stats.duels.entity";
import { StatsGoalkeepingEntity } from "../stats/stats.goalkeeping.entity";
import { StatsPassesDetailsEntity } from "../stats/stats.passes-details.entity";
import { StatsShotsEntity } from "../stats/stats.shots.entity";

@Entity("match_stats_detailed")
export class MatchStatsDetailedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => StatsShotsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    shots?: StatsShotsEntity;

    @OneToOne(() => StatsAttackEntity, { nullable: true, cascade: true })
    @JoinColumn()
    attack?: StatsAttackEntity;

    @OneToOne(() => StatsPassesDetailsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    passesDetails?: StatsPassesDetailsEntity;

    @OneToOne(() => StatsDuelsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    duels?: StatsDuelsEntity;

    @OneToOne(() => StatsDefendingEntity, { nullable: true, cascade: true })
    @JoinColumn()
    defending?: StatsDefendingEntity;

    @OneToOne(() => StatsGoalkeepingEntity, { nullable: true, cascade: true })
    @JoinColumn()
    goalkeeping?: StatsGoalkeepingEntity;
}
