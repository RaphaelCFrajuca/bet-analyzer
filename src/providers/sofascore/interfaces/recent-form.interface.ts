export interface RecentFormResponse {
    events: MatchEvent[];
    points: Record<string, number>;
}

export interface MatchEvent {
    tournament: Tournament;
    season: Season;
    roundInfo: RoundInfo;
    customId: string;
    status: Status;
    winnerCode: number;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: Score;
    awayScore: Score;
    time: TimeInfo;
    changes: Changes;
    hasGlobalHighlights: boolean;
    hasXg: boolean;
    hasEventPlayerStatistics: boolean;
    hasEventPlayerHeatMap: boolean;
    crowdsourcingDataDisplayEnabled: boolean;
    id: number;
    slug: string;
    startTimestamp: number;
    finalResultOnly: boolean;
    feedLocked: boolean;
    isEditor: boolean;
    previousLegEventId?: number;
}

export interface Tournament {
    name: string;
    slug: string;
    category: Category;
    uniqueTournament: UniqueTournament;
    priority: number;
    isGroup: boolean;
    isLive: boolean;
    id: number;
}

export interface UniqueTournament {
    name: string;
    slug: string;
    primaryColorHex: string;
    secondaryColorHex: string;
    category: Category;
    userCount: number;
    id: number;
    hasPerformanceGraphFeature: boolean;
    hasEventPlayerStatistics: boolean;
    displayInverseHomeAwayTeams: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    sport: Sport;
    flag: string;
    alpha2: string;
}

export interface Sport {
    name: string;
    slug: string;
    id: number;
}

export interface Season {
    name: string;
    year: string;
    editor: boolean;
    id: number;
}

export interface RoundInfo {
    round: number;
    name: string;
    slug: string;
    cupRoundType: number;
}

export interface Status {
    code: number;
    description: string;
    type: string;
}

export interface Team {
    id: number;
    name: string;
    slug: string;
    shortName: string;
    gender: string;
    sport: Sport;
    userCount: number;
    nameCode: string;
    disabled: boolean;
    national: boolean;
    type: number;
    entityType: string;
    subTeams: any[];
    teamColors: TeamColors;
    fieldTranslations: FieldTranslations;
}

export interface TeamColors {
    primary: string;
    secondary: string;
    text: string;
}

export interface FieldTranslations {
    nameTranslation: {
        [langCode: string]: string;
    };
    shortNameTranslation: {
        [langCode: string]: string;
    };
}

export interface Score {
    current: number;
    display: number;
    period1: number;
    period2: number;
    normaltime: number;
}

export interface TimeInfo {
    periodLength?: number;
    overtimeLength?: number;
    totalPeriodCount?: number;
    currentPeriodStartTimestamp: number;
}

export interface Changes {
    changes: string[];
    changeTimestamp: number;
}
