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

    @ManyToOne(() => TeamEntity, { eager: true, cascade: true })
    @JoinColumn()
    homeTeam: TeamEntity;

    @ManyToOne(() => TeamEntity, { eager: true, cascade: true })
    @JoinColumn()
    awayTeam: TeamEntity;

    @Column({ type: "int", nullable: true })
    actualHomeScore?: number;

    @Column({ type: "int", nullable: true })
    actualAwayScore?: number;

    @Column({ type: "date" })
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

    @OneToOne(() => MatchRecentDuelsEntity, { eager: true, cascade: true })
    @JoinColumn()
    recentDuels?: MatchRecentDuelsEntity;

    @Column({ type: "int", nullable: true })
    roundNumber?: number;

    @OneToOne(() => MatchRefereeEntity, { eager: true, cascade: true })
    @JoinColumn()
    referee?: MatchRefereeEntity;

    @OneToOne(() => MatchLineupEntity, { eager: true, cascade: true })
    @JoinColumn()
    lineups?: MatchLineupEntity;

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats)
    homeTeamRecentForm?: MatchStatsEntity[];

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats)
    awayTeamRecentForm?: MatchStatsEntity[];

    @OneToMany(() => MatchMarketEntity, market => market)
    markets?: MatchMarketEntity[];

    @OneToMany(() => MatchBetEntity, bet => bet)
    bettingSuggestions?: MatchBetEntity[];
}
