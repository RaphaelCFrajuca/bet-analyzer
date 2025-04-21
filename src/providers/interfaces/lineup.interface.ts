export interface Lineup {
    confirmed: boolean;
    home: TeamLineup;
    away: TeamLineup;
}

export interface TeamLineup {
    players: Player[];
    supportStaff: any[];
    formation: string;
    playerColor: PlayerColor;
    goalkeeperColor: PlayerColor;
    missingPlayers: MissingPlayer[];
}

export interface Player {
    avgRating: number;
    player: PlayerDetails;
    teamId: number;
    shirtNumber: number;
    jerseyNumber: string;
    position: string;
    substitute: boolean;
}

export interface PlayerDetails {
    name: string;
    slug: string;
    shortName: string;
    position: string;
    jerseyNumber: string;
    height: number;
    userCount: number;
    id: number;
    country: Country;
    marketValueCurrency: string;
    dateOfBirthTimestamp: number;
    proposedMarketValueRaw: MarketValue;
    fieldTranslations: FieldTranslations;
}

export interface Country {
    alpha2: string;
    alpha3: string;
    name: string;
    slug: string;
}

export interface MarketValue {
    value: number;
    currency: string;
}

export interface FieldTranslations {
    nameTranslation: Translation;
    shortNameTranslation: Translation;
}

export interface Translation {
    ar?: string;
    hi?: string;
    bn?: string;
}

export interface PlayerColor {
    primary: string;
    number: string;
    outline: string;
    fancyNumber: string;
}

export interface MissingPlayer {
    player: PlayerDetails;
    type: string;
    reason: number;
}
