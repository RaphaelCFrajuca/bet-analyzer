import { Bet } from "src/ai/interfaces/betting-response.interface";
import { AwayTeamPerformance, HomeTeamPerformance, Lineup, Market } from "src/match/interfaces/match.interface";
import { SureBet } from "src/match/service/match.service";
import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchRecentDuelsEntity } from "./match.recent-duels.entity";
import { MatchRefereeEntity } from "./match.referee.entity";
import { MatchStatsEntity } from "./match.stats.entity";
import { MatchStatusEntity } from "./match.status.entity";
import { TeamEntity } from "./team.entity";

@Entity("match")
export class MatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TeamEntity, team => team.id, { nullable: false })
    homeTeam: TeamEntity;

    @ManyToOne(() => TeamEntity, team => team.id, { nullable: false })
    awayTeam: TeamEntity;

    @Column({ type: "int", nullable: false })
    actualHomeScore?: number | undefined;

    @Column({ type: "int", nullable: false })
    actualAwayScore?: number | undefined;

    @Column({ type: "date", nullable: false })
    date: Date;

    @Column({ type: "varchar", length: 255, nullable: false })
    country?: string | undefined;

    @Column({ type: "varchar", length: 255, nullable: false })
    tournament: string;

    @OneToOne(() => MatchStatusEntity, matchStatus => matchStatus.match, { nullable: false })
    status: MatchStatusEntity;

    @OneToOne(() => MatchStatsEntity, matchStatistics => matchStatistics, { nullable: true })
    matchStatistics?: MatchStatsEntity | undefined;

    @OneToOne(() => MatchRecentDuelsEntity, matchRecentDuels => matchRecentDuels, { nullable: true })
    recentDuels?: RecentDuels | undefined;

    @Column({ type: "int", nullable: true })
    roundNumber?: number | undefined;

    @OneToOne(() => MatchRefereeEntity, referee => referee, { nullable: true })
    referee?: MatchRefereeEntity | undefined;

    lineups?: Lineup | undefined;
    homeTeamPerformance: HomeTeamPerformance;
    awayTeamPerformance: AwayTeamPerformance;
    markets?: Market[] | undefined;
    surebets?: SureBet[] | undefined;
    bettingSuggestions?: Bet[] | undefined;
}
