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

    @ManyToOne(() => MatchEntity, match => match, { nullable: false })
    @JoinColumn()
    match: MatchEntity;

    @Column({ type: "date", nullable: false })
    date: Date;

    @OneToOne(() => TeamEntity, team => team, { nullable: false })
    homeTeam: TeamEntity;

    @OneToOne(() => TeamEntity, team => team, { nullable: false })
    awayTeam: TeamEntity;

    @OneToOne(() => MatchTeamScoreEntity, matchTeamScore => matchTeamScore, { nullable: false })
    homeTeamScore: MatchTeamScoreEntity;

    @OneToOne(() => MatchTeamScoreEntity, matchTeamScore => matchTeamScore, { nullable: false })
    awayTeamScore: MatchTeamScoreEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    tournament: string;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    ballPossession?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    expectedGoals?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    totalShots?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    goalkeeperSaves?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    cornerKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    fouls?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    passes?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    tackles?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    freeKicks?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    yellowCards?: StatsEntity | undefined;

    @OneToOne(() => StatsEntity, stats => stats.matchStats, { nullable: true })
    redCards?: StatsEntity | undefined;

    @OneToOne(() => StatsShotsEntity, statsShots => statsShots, { nullable: true })
    shots?: StatsShotsEntity | undefined;

    @OneToOne(() => StatsAttackEntity, statsAttack => statsAttack, { nullable: true })
    attack?: StatsAttackEntity | undefined;

    @OneToOne(() => StatsPassesDetailsEntity, statsPassesDetails => statsPassesDetails, { nullable: true })
    passesDetails?: StatsPassesDetailsEntity | undefined;

    @OneToOne(() => StatsDuelsEntity, StatsDuelsEntity => StatsDuelsEntity, { nullable: true })
    duels?: StatsDuelsEntity | undefined;

    @OneToOne(() => StatsDefendingEntity, statsDefending => statsDefending, { nullable: true })
    defending?: StatsDefendingEntity | undefined;

    @OneToOne(() => StatsGoalkeepingEntity, statsGoalkeeping => statsGoalkeeping, { nullable: true })
    goalkeeping?: StatsGoalkeepingEntity | undefined;
}
