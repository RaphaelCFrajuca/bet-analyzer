import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_defending")
export class StatsDefendingEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    tacklesWon?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    totalTackles?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    interceptions?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    recoveries?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    clearances?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    errorsLeadingToShot?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    errorsLeadingToGoal?: StatsEntity;
}
