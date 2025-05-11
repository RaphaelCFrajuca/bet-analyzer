import { Statistic } from "src/performance/interfaces/recent-form-statistics.interface";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchStatsEntity } from "./match.stats.entity";

@Entity("stats")
export class StatsEntity implements Statistic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    home: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    away: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    statisticsType?: string | undefined;

    @OneToOne(() => MatchStatsEntity, matchStats => matchStats, { nullable: false })
    matchStats: MatchStatsEntity;
}
