import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "../match/match.stats.entity";
import { TeamEntity } from "./team.entity";

@Entity("team_recent_form")
export class TeamRecentFormEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => TeamEntity, team => team.recentForm)
    @JoinColumn({ name: "team_id" })
    team: TeamEntity;

    @ManyToOne(() => MatchStatsEntity, { eager: true, orphanedRowAction: "delete" })
    @JoinColumn({ name: "match_stats_id" })
    stats: MatchStatsEntity;
}
