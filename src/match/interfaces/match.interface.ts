import { Bet } from "src/ai/interfaces/betting-response.interface";
import { RecentFormStatistics } from "src/performance/interfaces/recent-form-statistics.interface";
import { Status } from "src/providers/interfaces/events-list.interface";
import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";
import { SureBet } from "../service/match.service";

export interface Match {
    id: number;
    homeTeam: string;
    homeTeamId: number;
    awayTeam: string;
    awayTeamId: number;
    actualHomeScore?: number;
    actualAwayScore?: number;
    date: Date;
    country?: string;
    tournament: string;
    status?: Status;
    actualMatchStatistics?: RecentFormStatistics;
    recentDuels?: RecentDuels;
    roundInfo?: Round;
    referee?: Referee;
    lineups?: Lineup;
    homeTeamPerformance: HomeTeamPerformance;
    awayTeamPerformance: AwayTeamPerformance;
    markets?: Market[];
    surebets?: SureBet[];
    bettingSuggestions?: Bet[];
}

export interface Round {
    round?: number;
}

export interface Referee {
    id?: number;
    name?: string;
    yellowCards?: number;
    redCards?: number;
    games?: number;
}

export interface Lineup {
    confirmed?: boolean;
    homeTeam?: TeamLineup;
    awayTeam?: TeamLineup;
}

export interface TeamLineup {
    formation?: string;
    players?: Player[];
    missingPlayers?: Player[];
}

export interface Player {
    avgRating?: number;
    id?: number;
    name?: string;
    jerseyNumber?: string;
    position?: string;
    substitute?: boolean;
}

export interface HomeTeamPerformance {
    homeTeamRecentForm?: RecentFormStatistics[];
}

export interface AwayTeamPerformance {
    awayTeamRecentForm?: RecentFormStatistics[];
}

export interface Market {
    marketId: number;
    marketName: string;
    choiceGroup?: string;
    choices: Choice[];
}

export interface Choice {
    name: string;
    initialOddValue: string;
    oddValue: string;
    slipContent: string;
    change: number;
}
