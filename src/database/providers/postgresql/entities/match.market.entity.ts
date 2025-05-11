import { Market } from "src/match/interfaces/match.interface";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MarketChoicesEntity } from "./market.choices.entity";
import { MatchEntity } from "./match.entity";

@Entity("match_market")
export class MatchMarketEntity implements Market {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MatchEntity, match => match.markets, { nullable: false })
    match: MatchEntity;

    @Column({ type: "int", nullable: false })
    marketId: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    marketName: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    choiceGroup?: string | undefined;

    @OneToMany(() => MarketChoicesEntity, choice => choice.market, { nullable: false })
    choices: MarketChoicesEntity[];
}
