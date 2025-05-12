import { Statistic } from "src/performance/interfaces/recent-form-statistics.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("stats")
export class StatsEntity implements Statistic {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    home: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    away: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    statisticsType?: string | undefined;
}
