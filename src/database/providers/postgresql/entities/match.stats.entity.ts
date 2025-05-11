import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchTeamScoreEntity } from "./match.team.score.entity";
import { StatsAttackEntity } from "./stats.attack.entity";
import { StatsDefendingEntity } from "./stats.defending.entity";
import { StatsDuelsEntity } from "./stats.duels.entity";
import { StatsEntity } from "./stats.entity";
import { StatsGoalkeepingEntity } from "./stats.goalkeeping.entity";
import { StatsPassesDetailsEntity } from "./stats.passes-details.entity";
import { StatsShotsEntity } from "./stats.shots.entity";
import { TeamEntity } from "./team.entity";

@Entity("match_stats")
export class MatchStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
