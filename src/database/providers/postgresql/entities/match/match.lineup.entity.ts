import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamLineupEntity } from "../lineup/lineup.team-lineup.entity";

@Entity("match_lineup")
export class MatchLineupEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "boolean", nullable: true })
    confirmed: boolean;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    home: TeamLineupEntity;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    away: TeamLineupEntity;
}
