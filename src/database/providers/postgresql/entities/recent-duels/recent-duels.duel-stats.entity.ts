import { DuelStats } from "src/providers/interfaces/recent-duels.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("recent-duels_duel-stats")
export class RecentDuelsDuelStatsEntity implements DuelStats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    homeWins: number;

    @Column({ type: "int", nullable: false })
    awayWins: number;

    @Column({ type: "int", nullable: false })
    draws: number;
}
