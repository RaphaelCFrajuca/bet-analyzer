import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchBetEntity } from "./match.bet.entity";
import { MatchLineupEntity } from "./match.lineup.entity";
import { MatchMarketEntity } from "./match.market.entity";
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

    @OneToOne(() => MatchLineupEntity, matchLineup => matchLineup, { nullable: true, eager: true })
    lineups?: MatchLineupEntity | undefined;

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats.match, { nullable: true })
    homeTeamRecentForm: MatchStatsEntity[];

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats.match, { nullable: true })
    awayTeamRecentForm: MatchStatsEntity[];

    @OneToMany(() => MatchMarketEntity, matchMarket => matchMarket.match, { nullable: true })
    markets?: MatchMarketEntity[] | undefined;

    @OneToMany(() => MatchBetEntity, matchBet => matchBet.match, { nullable: true })
    bettingSuggestions?: MatchBetEntity[] | undefined;
}
