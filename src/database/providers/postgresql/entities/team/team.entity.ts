import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "../match/match.stats.entity";

@Entity("team")
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @OneToMany(() => MatchStatsEntity, matchStats => matchStats, { nullable: true, eager: true, cascade: true })
    recentForm?: MatchStatsEntity[];
}
