import { Column, Entity, OneToMany } from "typeorm";
import { MissingPlayerEntity } from "./lineup.missing-player.entity";
import { LineupPlayerEntity } from "./lineup.player.entity";

@Entity("lineup_team-lineup")
export class TeamLineupEntity {
    @OneToMany(() => LineupPlayerEntity, player => player.teamLineUp, { nullable: false })
    players: LineupPlayerEntity[];

    @Column({ type: "varchar", length: 255, nullable: false })
    formation: string;

    @OneToMany(() => MissingPlayerEntity, missingPlayer => missingPlayer.teamLineUp, { nullable: false })
    missingPlayers: MissingPlayerEntity[];
}
