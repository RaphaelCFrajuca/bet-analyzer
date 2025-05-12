import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "../stats/stats.entity";

@Entity("match_stats_general")
export class MatchStatsGeneralEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    ballPossession?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    expectedGoals?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    totalShots?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    goalkeeperSaves?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    cornerKicks?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    fouls?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    passes?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    tackles?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    freeKicks?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    yellowCards?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, cascade: true })
    @JoinColumn()
    redCards?: StatsEntity;
}
