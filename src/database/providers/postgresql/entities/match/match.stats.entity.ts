import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { MatchEntity } from "./match.entity";
import { MatchStatsDetailedEntity } from "./match.stats.detailed.entity";
import { MatchStatsGeneralEntity } from "./match.stats.general.entity";
import { MatchTeamScoreEntity } from "./match.team.score.entity";

@Entity("match_stats")
export class MatchStatsEntity {
    @PrimaryColumn()
    id: number;

    @OneToOne(() => MatchEntity, match => match.matchStatistics)
    match?: MatchEntity;

    @Column({ type: "date", nullable: false })
    date: Date;

    @OneToOne(() => MatchTeamScoreEntity, { nullable: false, eager: true, cascade: true })
    @JoinColumn({ name: "home_team_score_id" })
    homeTeamScore: MatchTeamScoreEntity;

    @OneToOne(() => MatchTeamScoreEntity, { nullable: false, eager: true, cascade: true })
    @JoinColumn({ name: "away_team_score_id" })
    awayTeamScore: MatchTeamScoreEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    tournament: string;

    @OneToOne(() => MatchStatsGeneralEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    general?: MatchStatsGeneralEntity;

    @OneToOne(() => MatchStatsDetailedEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    detailed?: MatchStatsDetailedEntity;
}
