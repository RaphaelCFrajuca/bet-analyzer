import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { MatchEntity } from "../match/match.entity";
import { TeamRecentFormEntity } from "./team.recent-form.entity";

@Entity("team")
export class TeamEntity {
    @PrimaryColumn()
    id: number;

    @OneToMany(() => MatchEntity, match => match.homeTeam)
    homeMatches?: MatchEntity[];

    @OneToMany(() => MatchEntity, match => match.awayTeam)
    awayMatches?: MatchEntity[];

    @OneToMany(() => TeamRecentFormEntity, recentForm => recentForm.team, { eager: true, orphanedRowAction: "delete" })
    recentForm: TeamRecentFormEntity[];

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;
}
