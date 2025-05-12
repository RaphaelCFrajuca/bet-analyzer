import { Market } from "src/match/interfaces/match.interface";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MarketChoicesEntity } from "../market/market.choices.entity";

@Entity("match_market")
export class MatchMarketEntity implements Market {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "int", nullable: false })
    marketId: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    marketName: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    choiceGroup?: string | undefined;

    @OneToMany(() => MarketChoicesEntity, choice => choice.market, { nullable: false, eager: true, cascade: true })
    choices: MarketChoicesEntity[];
}
