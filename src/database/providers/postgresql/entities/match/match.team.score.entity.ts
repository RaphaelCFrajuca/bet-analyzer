import { TeamScore } from "src/performance/interfaces/recent-form-statistics.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("match_team_score")
export class MatchTeamScoreEntity implements TeamScore {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "int", nullable: true })
    total: number;

    @Column({ type: "int", nullable: true })
    firstHalf: number;

    @Column({ type: "int", nullable: true })
    secondHalf: number;
}
