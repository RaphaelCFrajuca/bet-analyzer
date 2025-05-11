import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_goalkeeping")
export class StatsGoalkeepingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    totalSaves?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    goalsPrevented?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    bigSaves?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    punches?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    goalKicks?: StatsEntity;
}
