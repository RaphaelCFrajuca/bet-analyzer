import { Bet } from "src/ai/interfaces/betting-response.interface";
import { AwayTeamPerformance, HomeTeamPerformance, Lineup, Market, Match, Round } from "src/match/interfaces/match.interface";
import { SureBet } from "src/match/service/match.service";
import { RecentFormStatistics } from "src/performance/interfaces/recent-form-statistics.interface";
import { Referee, Status } from "src/providers/interfaces/events-list.interface";
import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MatchEntity implements Partial<Match> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    homeTeam: string;

    @Column({ type: "int", nullable: false })
    homeTeamId: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    awayTeam: string;

    @Column({ type: "int", nullable: false })
    awayTeamId: number;

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

    status?: Status | undefined;
    actualMatchStatistics?: RecentFormStatistics | undefined;
    recentDuels?: RecentDuels | undefined;
    roundInfo?: Round | undefined;
    referee?: Referee | undefined;
    lineups?: Lineup | undefined;
    homeTeamPerformance: HomeTeamPerformance;
    awayTeamPerformance: AwayTeamPerformance;
    markets?: Market[] | undefined;
    surebets?: SureBet[] | undefined;
    bettingSuggestions?: Bet[] | undefined;
}
