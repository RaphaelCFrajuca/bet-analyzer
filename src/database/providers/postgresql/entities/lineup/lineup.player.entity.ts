import { Player } from "src/providers/interfaces/lineup.interface";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TeamLineupEntity } from "./lineup.team-lineup.entity";

@Entity("lineup_player")
export class LineupPlayerEntity implements Partial<Player> {
    @Index()
    @PrimaryColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @ManyToOne(() => TeamLineupEntity, teamLineup => teamLineup.players, { nullable: false })
    @JoinColumn()
    teamLineUp?: TeamLineupEntity;

    @Column({ type: "float", nullable: true })
    avgRating: number | undefined;

    @Column({ type: "int", nullable: true })
    teamId: number | undefined;

    @Column({ type: "int", nullable: true })
    shirtNumber: number | undefined;

    @Column({ type: "varchar", length: 255, nullable: true })
    jerseyNumber: string | undefined;

    @Column({ type: "varchar", length: 255, nullable: true })
    position: string | undefined;

    @Column({ type: "boolean", nullable: true })
    substitute: boolean | undefined;
}
