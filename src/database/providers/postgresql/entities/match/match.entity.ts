import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
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
    @Index()
    @PrimaryColumn({ unique: true })
    id: number;

    @ManyToOne(() => TeamEntity, team => team.homeMatches, { eager: true, cascade: true })
    @JoinColumn()
    homeTeam: TeamEntity;

    @ManyToOne(() => TeamEntity, team => team.awayMatches, { eager: true, cascade: true })
    @JoinColumn()
    awayTeam: TeamEntity;

    @Column({ type: "int", nullable: true })
    actualHomeScore?: number;

    @Column({ type: "int", nullable: true })
    actualAwayScore?: number;

    @Column({ type: "timestamptz" })
    date: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    country?: string;

    @Column({ type: "varchar", length: 255 })
    tournament: string;

    @OneToOne(() => MatchStatusEntity, { eager: true, cascade: true })
    @JoinColumn()
    status: MatchStatusEntity;

    @OneToOne(() => MatchStatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    matchStatistics?: MatchStatsEntity;

    @OneToOne(() => MatchRecentDuelsEntity, recentDuels => recentDuels.match, { eager: true, cascade: true })
    @JoinColumn()
    recentDuels?: MatchRecentDuelsEntity;

    @Column({ type: "int", nullable: true })
    roundNumber?: number;

    @OneToOne(() => MatchRefereeEntity, { eager: true, cascade: true })
    @JoinColumn()
    referee?: MatchRefereeEntity;

    @OneToOne(() => MatchLineupEntity, matchLineup => matchLineup.match, { eager: true, cascade: true })
    @JoinColumn()
    lineups?: MatchLineupEntity;

    @OneToMany(() => MatchMarketEntity, market => market.match, { nullable: true, eager: true, cascade: true, orphanedRowAction: "delete" })
    markets?: MatchMarketEntity[];

    @OneToMany(() => MatchBetEntity, bet => bet.match, { nullable: true, eager: true, cascade: true, orphanedRowAction: "delete" })
    bettingSuggestions?: MatchBetEntity[];
}
