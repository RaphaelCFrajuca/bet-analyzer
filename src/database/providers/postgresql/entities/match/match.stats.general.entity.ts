import { Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "../stats/stats.entity";
import { MatchStatsEntity } from "./match.stats.entity";

@Entity("match_stats_general")
export class MatchStatsGeneralEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => MatchStatsEntity, matchStats => matchStats.general)
    matchStats?: MatchStatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    ballPossession?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    expectedGoals?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    totalShots?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    goalkeeperSaves?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    cornerKicks?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    fouls?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    passes?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    tackles?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    freeKicks?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    yellowCards?: StatsEntity;

    @Index()
    @OneToOne(() => StatsEntity, { nullable: true, cascade: true, eager: true })
    @JoinColumn()
    redCards?: StatsEntity;
}
