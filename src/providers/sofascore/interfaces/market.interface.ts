export interface MarketChoice {
    initialFractionalValue: number | string;
    fractionalValue: number | string;
    name: string;
    slipContent: string;
    change: number;
}

export interface Market {
    structureType: number;
    marketId: number;
    marketName: string;
    isLive: boolean;
    suspended: boolean;
    id: number;
    marketGroup: string;
    marketPeriod: string;
    choices: MarketChoice[];
    choiceGroup?: string;
}

export interface MarketsResponse {
    markets: Market[];
    eventId: number;
}
