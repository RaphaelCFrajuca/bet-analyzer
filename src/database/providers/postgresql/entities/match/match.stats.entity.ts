import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsAttackEntity } from "../stats/stats.attack.entity";
import { StatsDefendingEntity } from "../stats/stats.defending.entity";
import { StatsDuelsEntity } from "../stats/stats.duels.entity";
import { StatsEntity } from "../stats/stats.entity";
import { StatsGoalkeepingEntity } from "../stats/stats.goalkeeping.entity";
import { StatsPassesDetailsEntity } from "../stats/stats.passes-details.entity";
import { StatsShotsEntity } from "../stats/stats.shots.entity";
import { MatchTeamScoreEntity } from "./match.team.score.entity";

@Entity("match_stats")
export class MatchStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date", nullable: false })
    date: Date;

    @Column({ type: "varchar", length: 255, nullable: false })
    homeTeam: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    awayTeam: string;

    @OneToOne(() => MatchTeamScoreEntity, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    homeTeamScore: MatchTeamScoreEntity;

    @OneToOne(() => MatchTeamScoreEntity, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    awayTeamScore: MatchTeamScoreEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    tournament: string;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    ballPossession?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    expectedGoals?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    totalShots?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    goalkeeperSaves?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    cornerKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    fouls?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    passes?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    tackles?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    freeKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    yellowCards?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    redCards?: StatsEntity | undefined;

    @OneToOne(() => StatsShotsEntity, statsShots => statsShots, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    shots?: StatsShotsEntity | undefined;

    @OneToOne(() => StatsAttackEntity, statsAttack => statsAttack, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    attack?: StatsAttackEntity | undefined;

    @OneToOne(() => StatsPassesDetailsEntity, statsPassesDetails => statsPassesDetails, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    passesDetails?: StatsPassesDetailsEntity | undefined;

    @OneToOne(() => StatsDuelsEntity, StatsDuelsEntity => StatsDuelsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    duels?: StatsDuelsEntity | undefined;

    @OneToOne(() => StatsDefendingEntity, statsDefending => statsDefending, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    defending?: StatsDefendingEntity | undefined;

    @OneToOne(() => StatsGoalkeepingEntity, statsGoalkeeping => statsGoalkeeping, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    goalkeeping?: StatsGoalkeepingEntity | undefined;
}
