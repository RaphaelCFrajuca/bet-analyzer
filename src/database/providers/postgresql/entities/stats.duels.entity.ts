import { Entity, JoinColumn, OneToOne } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_duels")
export class StatsDuelsEntity {
    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    duels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    dispossessed?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    groundDuels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    aerialDuels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true })
    @JoinColumn()
    dribbles?: StatsEntity;
}
