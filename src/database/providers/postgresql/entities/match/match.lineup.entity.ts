import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamLineupEntity } from "../lineup/lineup.team-lineup.entity";
import { MatchEntity } from "./match.entity";

@Entity("match_lineup")
export class MatchLineupEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => MatchEntity, match => match.lineups, { nullable: false })
    match?: MatchEntity;

    @Column({ type: "boolean", nullable: true })
    confirmed: boolean;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup.lineupHome, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    home: TeamLineupEntity;

    @OneToOne(() => TeamLineupEntity, teamLineup => teamLineup.lineupAway, { nullable: false, eager: true, cascade: true })
    @JoinColumn()
    away: TeamLineupEntity;
}
