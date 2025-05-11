import { Choice } from "src/match/interfaces/match.interface";
import { Column, Entity, ManyToOne } from "typeorm";
import { MatchMarketEntity } from "../match/match.market.entity";

@Entity("market_choices")
export class MarketChoicesEntity implements Choice {
    @ManyToOne(() => MatchMarketEntity, matchMarket => matchMarket.choices, { nullable: false })
    market: MatchMarketEntity;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    initialOddValue: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    oddValue: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    slipContent: string;

    @Column({ type: "int", nullable: false })
    change: number;
}
