import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_defending")
export class StatsDefendingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    tacklesWon?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    totalTackles?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    interceptions?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    recoveries?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    clearances?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    errorsLeadingToShot?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    errorsLeadingToGoal?: StatsEntity;
}
