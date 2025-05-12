import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TeamLineupEntity } from "./lineup.team-lineup.entity";

@Entity("lineup_missing-player")
export class MissingPlayerEntity {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => TeamLineupEntity, teamLineup => teamLineup.missingPlayers, { nullable: false })
    @JoinColumn()
    teamLineUp?: TeamLineupEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    position: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    type: string;

    @Column({ type: "int", nullable: false })
    reason: number;
}
