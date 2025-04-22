import { RecentFormStatistics } from "src/performance/interfaces/recent-form-statistics.interface";
import { Status } from "src/providers/interfaces/events-list.interface";
import { RecentDuels } from "src/providers/interfaces/recent-duels.interface";

export interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    actualHomeScore?: number;
    actualAwayScore?: number;
    date: Date;
    country?: string;
    tournament: string;
    status: Status;
    recentDuels?: RecentDuels;
    roundInfo?: Round;
    referee?: Referee;
    lineups?: Lineup;
    homeTeamPerformance: HomeTeamPerformance;
    awayTeamPerformance: AwayTeamPerformance;
    markets?: Market[];
}

interface Round {
    round?: number;
}

interface Referee {
    id?: number;
    name?: string;
    yellowCards?: number;
    redCards?: number;
    games?: number;
}

interface Lineup {
    confirmed?: boolean;
    homeTeam?: TeamLineup;
    awayTeam?: TeamLineup;
}

interface TeamLineup {
    formation?: string;
    players?: Player[];
    missingPlayers?: Player[];
}

interface Player {
    avgRating?: number;
    id?: number;
    name?: string;
    jerseyNumber?: string;
    position?: string;
    substitute?: boolean;
}

interface HomeTeamPerformance {
    homeTeamRecentForm?: RecentFormStatistics[];
}

interface AwayTeamPerformance {
    awayTeamRecentForm?: RecentFormStatistics[];
}

export interface Market {
    marketId: number;
    marketName: string;
    choiceGroup?: string;
    choices: Choice[];
}

interface Choice {
    name: string;
    initialOddValue: string;
    oddValue: string;
    slipContent: string;
    change: number;
}
