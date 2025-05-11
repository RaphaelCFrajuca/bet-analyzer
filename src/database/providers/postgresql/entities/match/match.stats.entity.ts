import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsAttackEntity } from "../stats/stats.attack.entity";
import { StatsDefendingEntity } from "../stats/stats.defending.entity";
import { StatsDuelsEntity } from "../stats/stats.duels.entity";
import { StatsEntity } from "../stats/stats.entity";
import { StatsGoalkeepingEntity } from "../stats/stats.goalkeeping.entity";
import { StatsPassesDetailsEntity } from "../stats/stats.passes-details.entity";
import { StatsShotsEntity } from "../stats/stats.shots.entity";
import { TeamEntity } from "../team/team.entity";
import { MatchEntity } from "./match.entity";
import { MatchTeamScoreEntity } from "./match.team.score.entity";

@Entity("match_stats")
export class MatchStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MatchEntity, match => match, { nullable: false, eager: true })
    @JoinColumn()
    match: MatchEntity;

    @Column({ type: "date", nullable: false })
    date: Date;

    @OneToOne(() => TeamEntity, team => team, { nullable: false, eager: true })
    @JoinColumn()
    homeTeam: TeamEntity;

    @OneToOne(() => TeamEntity, team => team, { nullable: false, eager: true })
    @JoinColumn()
    awayTeam: TeamEntity;

    @OneToOne(() => MatchTeamScoreEntity, matchTeamScore => matchTeamScore, { nullable: false, eager: true })
    @JoinColumn()
    homeTeamScore: MatchTeamScoreEntity;

    @OneToOne(() => MatchTeamScoreEntity, matchTeamScore => matchTeamScore, { nullable: false, eager: true })
    @JoinColumn()
    awayTeamScore: MatchTeamScoreEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    tournament: string;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    ballPossession?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    expectedGoals?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    totalShots?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    goalkeeperSaves?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    cornerKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    fouls?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    passes?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    tackles?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    freeKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    yellowCards?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true, eager: true })
    @JoinColumn()
    redCards?: StatsEntity | undefined;

    @OneToOne(() => StatsShotsEntity, statsShots => statsShots, { nullable: true, eager: true })
    @JoinColumn()
    shots?: StatsShotsEntity | undefined;

    @OneToOne(() => StatsAttackEntity, statsAttack => statsAttack, { nullable: true, eager: true })
    @JoinColumn()
    attack?: StatsAttackEntity | undefined;

    @OneToOne(() => StatsPassesDetailsEntity, statsPassesDetails => statsPassesDetails, { nullable: true, eager: true })
    @JoinColumn()
    passesDetails?: StatsPassesDetailsEntity | undefined;

    @OneToOne(() => StatsDuelsEntity, StatsDuelsEntity => StatsDuelsEntity, { nullable: true, eager: true })
    @JoinColumn()
    duels?: StatsDuelsEntity | undefined;

    @OneToOne(() => StatsDefendingEntity, statsDefending => statsDefending, { nullable: true, eager: true })
    @JoinColumn()
    defending?: StatsDefendingEntity | undefined;

    @OneToOne(() => StatsGoalkeepingEntity, statsGoalkeeping => statsGoalkeeping, { nullable: true, eager: true })
    @JoinColumn()
    goalkeeping?: StatsGoalkeepingEntity | undefined;
}
