export interface EventList {
    events: Event[];
}

export interface Event {
    tournament: Tournament;
    season: Season;
    roundInfo?: RoundInfo;
    customId: string;
    status: Status;
    homeTeam: Team;
    awayTeam: Team;
    homeScore?: Score;
    awayScore?: Score;
    time: Time;
    changes: Changes;
    hasGlobalHighlights: boolean;
    hasEventPlayerHeatMap?: boolean;
    detailId: number;
    crowdsourcingDataDisplayEnabled: boolean;
    id: number;
    slug: string;
    startTimestamp: number;
    finalResultOnly: boolean;
    feedLocked: boolean;
    isEditor: boolean;
    winnerCode?: number;

    venue?: Venue;
    referee: Referee;
    defaultPeriodCount?: number;
    defaultPeriodLength?: number;
    defaultOvertimeLength?: number;
    fanRatingEvent?: boolean;
    seasonStatisticsType?: string;
    showTotoPromo?: boolean;
    isLive?: boolean;
    priority?: number;
    competitionType?: number;
}

export interface Venue {
    city?: {
        name: string;
    };
    hidden?: boolean;
    slug?: string;
    name?: string;
    capacity?: number;
    id?: number;
    country?: Country;
    fieldTranslations?: FieldTranslations;
    stadium?: {
        name: string;
        capacity: number;
    };
}

export interface Referee {
    name: string;
    slug: string;
    yellowCards: number;
    redCards: number;
    yellowRedCards: number;
    games: number;
    sport: Sport;
    id: number;
    country: Country;
    fieldTranslations?: FieldTranslations;
}

interface Tournament {
    name: string;
    slug: string;
    category: Category;
    uniqueTournament: UniqueTournament;
    priority: number;
    id: number;
}

interface UniqueTournament {
    name: string;
    slug: string;
    category: Category;
    userCount: number;
    id: number;
    hasPerformanceGraphFeature: boolean;
    hasEventPlayerStatistics: boolean;
    displayInverseHomeAwayTeams: boolean;
}

interface Category {
    id: number;
    country: Country;
    name: string;
    slug: string;
    sport: Sport;
    flag: string;
    alpha2: string;
}

interface Country {
    alpha2: string;
    alpha3: string;
    name: string;
    slug: string;
}

interface Sport {
    name: string;
    slug: string;
    id: number;
}

interface Season {
    name: string;
    year: string;
    editor: boolean;
    id: number;
}

interface RoundInfo {
    round: number;
    name: string;
}

export interface Status {
    code: number;
    description: string;
    type: string;
}

interface Team {
    name: string;
    class?: number;
    slug: string;
    shortName: string;
    gender: string;
    sport: Sport;
    userCount: number;
    nameCode: string;
    disabled?: boolean;
    national: boolean;
    type: number;
    id: number;
    country: Country;
    entityType: string;
    subTeams: any[];
    teamColors: TeamColors;
    fieldTranslations?: FieldTranslations;
}

interface TeamColors {
    primary: string;
    secondary: string;
    text: string;
}

interface FieldTranslations {
    nameTranslation?: Record<string, string>;
    shortNameTranslation?: Record<string, string>;
}

interface Score {
    current?: number;
    display?: number;
    period1?: number;
    period2?: number;
    normaltime?: number;
}

interface Time {
    injuryTime2?: number;
    currentPeriodStartTimestamp?: number;
}

interface Changes {
    changes?: string[];
    changeTimestamp: number;
}
