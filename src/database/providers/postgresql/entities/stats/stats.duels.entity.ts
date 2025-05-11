import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatsEntity } from "./stats.entity";

@Entity("stats_duels")
export class StatsDuelsEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    duels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    dispossessed?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    groundDuels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    aerialDuels?: StatsEntity;

    @OneToOne(() => StatsEntity, { nullable: true, eager: true, cascade: true })
    @JoinColumn()
    dribbles?: StatsEntity;
}
