import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_shots")
export class StatsShotsEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    totalShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    shotsOnTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    hitWoodwork?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    shotsOffTarget?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    blockedShots?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    shotsInsideBox?: StatsEntity;

    @OneToOne(() => StatsEntity, stats => stats, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    shotsOutsideBox?: StatsEntity;
}
