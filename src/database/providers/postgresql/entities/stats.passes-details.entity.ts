import { Entity, JoinColumn, OneToOne } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_passes-details")
export class StatsPassesDetailsEntity {
    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    accuratePasses?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    throwIns?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    finalThirdEntries?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    finalThirdPhase?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    longBalls?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, nullable: true })
    @JoinColumn()
    crosses?: StatsEntity;
}
