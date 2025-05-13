import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "../match/match.stats.entity";
import { TeamEntity } from "./team.entity";

@Entity("team_recent_form")
export class TeamRecentFormEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Index()
    @ManyToOne(() => TeamEntity, team => team.recentForm)
    @JoinColumn({ name: "team_id" })
    team: TeamEntity;

    @Index()
    @ManyToOne(() => MatchStatsEntity, { eager: true, cascade: true, orphanedRowAction: "delete" })
    @JoinColumn({ name: "match_stats_id" })
    stats: MatchStatsEntity;
}
