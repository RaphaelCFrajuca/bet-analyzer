import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_attack")
export class StatsAttackEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    bigChancesScored?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    bigChancesMissed?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    throughBalls?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    touchesInPenaltyArea?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    fouledInFinalThird?: StatsEntity;

    @OneToOne(() => StatsEntity, { eager: true, cascade: true })
    @JoinColumn()
    offsides?: StatsEntity;
}
