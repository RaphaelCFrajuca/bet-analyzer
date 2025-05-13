import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchLineupEntity } from "../match/match.lineup.entity";
import { MissingPlayerEntity } from "./lineup.missing-player.entity";
import { LineupPlayerEntity } from "./lineup.player.entity";

@Entity("lineup_team-lineup")
export class TeamLineupEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => MatchLineupEntity, matchLineup => matchLineup.home, { nullable: false })
    lineupHome?: MatchLineupEntity;

    @OneToOne(() => MatchLineupEntity, matchLineup => matchLineup.away, { nullable: false })
    lineupAway?: MatchLineupEntity;

    @OneToMany(() => LineupPlayerEntity, player => player.teamLineUp, { nullable: false, cascade: true, eager: true })
    players: LineupPlayerEntity[];

    @Column({ type: "varchar", length: 255, nullable: true })
    formation?: string | undefined;

    @OneToMany(() => MissingPlayerEntity, missingPlayer => missingPlayer.teamLineUp, { nullable: false, cascade: true, eager: true })
    missingPlayers: MissingPlayerEntity[];
}
