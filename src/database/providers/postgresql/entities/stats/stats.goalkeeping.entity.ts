import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_goalkeeping")
export class StatsGoalkeepingEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    totalSaves?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    goalsPrevented?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    bigSaves?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    punches?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    goalKicks?: StatsEntity;
}
