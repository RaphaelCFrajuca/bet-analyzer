import { Player } from "src/providers/interfaces/lineup.interface";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamLineupEntity } from "./lineup.team-lineup.entity";

@Entity("lineup_player")
export class LineupPlayerEntity implements Partial<Player> {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TeamLineupEntity, teamLineup => teamLineup.players, { nullable: false })
    teamLineUp: TeamLineupEntity;

    @Column({ type: "int", nullable: false })
    avgRating: number;

    @Column({ type: "int", nullable: false })
    teamId: number;

    @Column({ type: "int", nullable: false })
    shirtNumber: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    jerseyNumber: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    position: string;

    @Column({ type: "boolean", nullable: false })
    substitute: boolean;
}
