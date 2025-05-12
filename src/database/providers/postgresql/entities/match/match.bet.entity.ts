import { Bet } from "src/ai/interfaces/betting-response.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("match_bet")
export class MatchBetEntity implements Bet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    marketName: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    bet: string;

    @Column({ type: "float", nullable: false })
    odd: number;

    @Column({ type: "int", nullable: false })
    confidence: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    explanation: string;

    @Column({ type: "float", nullable: false })
    ev: number;
}
