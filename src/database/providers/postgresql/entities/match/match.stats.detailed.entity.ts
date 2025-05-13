import { Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsAttackEntity } from "../stats/stats.attack.entity";
import { StatsDefendingEntity } from "../stats/stats.defending.entity";
import { StatsDuelsEntity } from "../stats/stats.duels.entity";
import { StatsGoalkeepingEntity } from "../stats/stats.goalkeeping.entity";
import { StatsPassesDetailsEntity } from "../stats/stats.passes-details.entity";
import { StatsShotsEntity } from "../stats/stats.shots.entity";
import { MatchStatsEntity } from "./match.stats.entity";

@Entity("match_stats_detailed")
export class MatchStatsDetailedEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => MatchStatsEntity, matchStats => matchStats.detailed)
    matchStats?: MatchStatsEntity;

    @Index()
    @OneToOne(() => StatsShotsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    shots?: StatsShotsEntity;

    @Index()
    @OneToOne(() => StatsAttackEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    attack?: StatsAttackEntity;

    @Index()
    @OneToOne(() => StatsPassesDetailsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    passesDetails?: StatsPassesDetailsEntity;

    @Index()
    @OneToOne(() => StatsDuelsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    duels?: StatsDuelsEntity;

    @Index()
    @OneToOne(() => StatsDefendingEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    defending?: StatsDefendingEntity;

    @Index()
    @OneToOne(() => StatsGoalkeepingEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    goalkeeping?: StatsGoalkeepingEntity;
}
