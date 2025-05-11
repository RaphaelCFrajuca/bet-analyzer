import { DuelStats } from "src/providers/interfaces/recent-duels.interface";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { MatchRecentDuelsEntity } from "./match.recent-duels.entity";

@Entity("recent-duels_duel-stats")
export class RecentDuelsDuelStatsEntity implements DuelStats {
    @OneToOne(() => MatchRecentDuelsEntity, matchRecentDuels => matchRecentDuels, { nullable: false })
    @JoinColumn()
    homeWins: number;

    @OneToOne(() => MatchRecentDuelsEntity, matchRecentDuels => matchRecentDuels, { nullable: false })
    @JoinColumn()
    awayWins: number;

    @OneToOne(() => MatchRecentDuelsEntity, matchRecentDuels => matchRecentDuels, { nullable: false })
    @JoinColumn()
    draws: number;
}
