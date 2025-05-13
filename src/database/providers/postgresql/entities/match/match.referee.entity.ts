import { Referee } from "src/providers/interfaces/events-list.interface";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { LineupCountryEntity } from "../lineup/lineup.country.entity";

@Entity("match_referee")
export class MatchRefereeEntity implements Partial<Referee> {
    @Column({ type: "varchar", length: 255, nullable: false })
    name: string | undefined;

    @Column({ type: "varchar", length: 255, nullable: false })
    slug: string | undefined;

    @Column({ type: "int", nullable: true })
    yellowCards: number | undefined;

    @Column({ type: "int", nullable: true })
    redCards: number | undefined;

    @Column({ type: "int", nullable: true })
    yellowRedCards: number | undefined;

    @Column({ type: "int", nullable: true })
    games: number | undefined;

    @Index()
    @PrimaryColumn()
    id: number;

    @OneToOne(() => LineupCountryEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    country: LineupCountryEntity | undefined;
}
