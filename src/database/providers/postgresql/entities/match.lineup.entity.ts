import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { TeamLineupEntity } from "./lineup.team-lineup.entity";

@Entity("match_lineup")
export class MatchLineupEntity {
    @Column({ type: "boolean", nullable: false })
    confirmed: boolean;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup, { nullable: false, eager: true })
    @JoinColumn()
    home: TeamLineupEntity;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup, { nullable: false, eager: true })
    @JoinColumn()
    away: TeamLineupEntity;
}
