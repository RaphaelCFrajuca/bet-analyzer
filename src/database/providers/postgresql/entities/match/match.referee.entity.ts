import { Referee } from "src/providers/interfaces/events-list.interface";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LineupCountryEntity } from "../lineup/lineup.country.entity";

@Entity("match_referee")
export class MatchRefereeEntity implements Partial<Referee> {
    @Column({ type: "varchar", length: 255, nullable: true })
    name: string | undefined;

    @Column({ type: "varchar", length: 255, nullable: true })
    slug: string | undefined;

    @Column({ type: "int", nullable: true })
    yellowCards: number | undefined;

    @Column({ type: "int", nullable: true })
    redCards: number | undefined;

    @Column({ type: "int", nullable: true })
    yellowRedCards: number | undefined;

    @Column({ type: "int", nullable: true })
    games: number | undefined;

    @PrimaryGeneratedColumn()
    id: number | undefined;

    @OneToOne(() => LineupCountryEntity, country => country, { nullable: true, eager: true, cascade: true })
    country: LineupCountryEntity | undefined;
}
