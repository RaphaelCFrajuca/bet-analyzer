import { Entity, OneToOne } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_shots")
export class StatsShotsEntity {
    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    totalShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    shotsOnTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    hitWoodwork?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    shotsOffTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    blockedShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    shotsInsideBox?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    shotsOutsideBox?: StatsEntity;
}
