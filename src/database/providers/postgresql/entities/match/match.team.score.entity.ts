import { TeamScore } from "src/performance/interfaces/recent-form-statistics.interface";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "./match.stats.entity";

@Entity("match_team_score")
export class MatchTeamScoreEntity implements TeamScore {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    total: number;

    @Column({ type: "int", nullable: false })
    firstHalf: number;

    @Column({ type: "int", nullable: false })
    secondHalf: number;

    @OneToOne(() => MatchStatsEntity, matchStats => matchStats, { nullable: false, eager: true })
    @JoinColumn()
    matchStats: MatchStatsEntity;
}
