import { Referee } from "src/providers/interfaces/events-list.interface";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LineupCountryEntity } from "./lineup.country.entity";

@Entity("match_referee")
export class MatchRefereeEntity implements Partial<Referee> {
    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    slug: string;

    @Column({ type: "int", nullable: false })
    yellowCards: number;

    @Column({ type: "int", nullable: false })
    redCards: number;

    @Column({ type: "int", nullable: false })
    yellowRedCards: number;

    @Column({ type: "int", nullable: false })
    games: number;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => LineupCountryEntity, country => country, { nullable: false })
    country: LineupCountryEntity;
}
