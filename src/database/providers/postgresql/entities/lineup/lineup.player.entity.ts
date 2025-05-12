import { Player } from "src/providers/interfaces/lineup.interface";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamLineupEntity } from "./lineup.team-lineup.entity";

@Entity("lineup_player")
export class LineupPlayerEntity implements Partial<Player> {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TeamLineupEntity, teamLineup => teamLineup.players, { nullable: false })
    @JoinColumn()
    teamLineUp?: TeamLineupEntity;

    @Column({ type: "int", nullable: true })
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
