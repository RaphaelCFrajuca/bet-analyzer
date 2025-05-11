import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchEntity } from "../match/match.entity";

@Entity("team")
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @OneToMany(() => MatchEntity, match => match)
    recentForm?: MatchEntity[];
}
