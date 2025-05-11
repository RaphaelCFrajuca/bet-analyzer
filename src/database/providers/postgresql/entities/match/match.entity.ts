import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "../team/team.entity";
import { MatchBetEntity } from "./match.bet.entity";
import { MatchLineupEntity } from "./match.lineup.entity";
import { MatchMarketEntity } from "./match.market.entity";
import { MatchRecentDuelsEntity } from "./match.recent-duels.entity";
import { MatchRefereeEntity } from "./match.referee.entity";
import { MatchStatsEntity } from "./match.stats.entity";
import { MatchStatusEntity } from "./match.status.entity";

@Entity("match")
export class MatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TeamEntity, team => team.id, { nullable: false, eager: true })
    @JoinColumn()
    homeTeam: TeamEntity;

    @ManyToOne(() => TeamEntity, team => team.id, { nullable: false, eager: true })
    @JoinColumn()
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

    @OneToOne(() => MatchStatusEntity, matchStatus => matchStatus.match, { nullable: false, eager: true })
    @JoinColumn()
    status: MatchStatusEntity;

    @OneToOne(() => MatchStatsEntity, matchStatistics => matchStatistics, { nullable: true, eager: true })
    @JoinColumn()
    matchStatistics?: MatchStatsEntity | undefined;

    @OneToOne(() => MatchRecentDuelsEntity, matchRecentDuels => matchRecentDuels, { nullable: true, eager: true })
    @JoinColumn()
    recentDuels?: MatchRecentDuelsEntity | undefined;

    @Column({ type: "int", nullable: true })
    roundNumber?: number | undefined;

    @OneToOne(() => MatchRefereeEntity, referee => referee, { nullable: true })
    @JoinColumn()
    referee?: MatchRefereeEntity | undefined;

    @OneToOne(() => MatchLineupEntity, matchLineup => matchLineup, { nullable: true, eager: true })
    @JoinColumn()
    lineups?: MatchLineupEntity | undefined;

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats.match, { nullable: true, eager: true })
    homeTeamRecentForm: MatchStatsEntity[];

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats.match, { nullable: true, eager: true })
    awayTeamRecentForm: MatchStatsEntity[];

    @OneToMany(() => MatchMarketEntity, matchMarket => matchMarket.match, { nullable: true, eager: true })
    markets?: MatchMarketEntity[] | undefined;

    @OneToMany(() => MatchBetEntity, matchBet => matchBet.match, { nullable: true, eager: true })
    bettingSuggestions?: MatchBetEntity[] | undefined;
}
