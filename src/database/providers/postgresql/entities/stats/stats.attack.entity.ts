import { Entity, JoinColumn, OneToOne } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_attack")
export class StatsAttackEntity {
    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    bigChancesScored?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    bigChancesMissed?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    throughBalls?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    touchesInPenaltyArea?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    fouledInFinalThird?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true })
    @JoinColumn()
    offsides?: StatsEntity;
}
