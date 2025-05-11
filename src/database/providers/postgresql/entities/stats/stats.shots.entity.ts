import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_shots")
export class StatsShotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    totalShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    shotsOnTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    hitWoodwork?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    shotsOffTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    blockedShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    shotsInsideBox?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true })
    @JoinColumn()
    shotsOutsideBox?: StatsEntity;
}
