import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { Event } from "../../providers/interfaces/events-list.interface";
import { RecentFormStatistics, Statistic } from "../interfaces/recent-form-statistics.interface";

@Injectable()
export class PerformanceService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
    ) {}

    async getRecentFormByTeamId(teamId: number) {
        const recentForm = await this.dataProvider.getRecentPerformanceByTeamId(teamId);

        const recentFormStatistics: RecentFormStatistics[] = await Promise.all(
            recentForm.events.map(async event => {
                const statistics = await this.dataProvider.getMatchStatisticsByEventId(event.id);

                return {
                    id: event.id,
                    date: new Date(event.startTimestamp * 1000),
                    homeTeam: event.homeTeam.name,
                    awayTeam: event.awayTeam.name,
                    homeTeamScore: {
                        total: event.homeScore.current,
                        firstHalf: event.homeScore.period1,
                        secondHalf: event.homeScore.period2,
                    },
                    awayTeamScore: {
                        total: event.awayScore.current,
                        firstHalf: event.awayScore.period1,
                        secondHalf: event.awayScore.period2,
                    },
                    tournament: event.tournament.name,
                    ballPossession: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[0]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[0]?.away || null,
                    },
                    expectedGoals: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[1]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[1]?.away || null,
                    },
                    totalShots: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[2]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[2]?.away || null,
                    },
                    goalkeeperSaves: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[3]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[3]?.away || null,
                    },
                    cornerKicks: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[4]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[4]?.away || null,
                    },
                    fouls: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[5]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[5]?.away || null,
                    },
                    passes: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[6]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[6]?.away || null,
                    },
                    tackles: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[7]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[7]?.away || null,
                    },
                    freeKicks: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[8]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[8]?.away || null,
                    },
                    yellowCards: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[9]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[9]?.away || null,
                    },
                    redCards: {
                        home: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[10]?.home || null,
                        away: statistics?.statistics?.[0]?.groups[0]?.statisticsItems[10]?.away || null,
                    },
                } as RecentFormStatistics;
            }),
        );

        return recentFormStatistics;
    }

    async getMatchStatisticsByEventId(event: Event) {
        const statistics = await this.dataProvider.getMatchStatisticsByEventId(event.id);

        const getStat = (group: string, name: string): Statistic => ({
            home: statistics?.statistics?.[0]?.groups.find(g => g.groupName === group)?.statisticsItems.find(s => s.name === name)?.home ?? "",
            away: statistics?.statistics?.[0]?.groups.find(g => g.groupName === group)?.statisticsItems.find(s => s.name === name)?.away ?? "",
            statisticsType: statistics?.statistics?.[0]?.groups.find(g => g.groupName === group)?.statisticsItems.find(s => s.name === name)?.statisticsType,
        });

        return {
            id: event.id,
            date: new Date(event.startTimestamp * 1000),
            homeTeam: event.homeTeam.name,
            awayTeam: event.awayTeam.name,
            homeTeamScore: {
                total: event?.homeScore?.current,
                firstHalf: event?.homeScore?.period1,
                secondHalf: event?.homeScore?.period2,
            },
            awayTeamScore: {
                total: event?.awayScore?.current,
                firstHalf: event?.awayScore?.period1,
                secondHalf: event?.awayScore?.period2,
            },
            tournament: event?.tournament?.name,
            ballPossession: getStat("Match overview", "Ball possession"),
            expectedGoals: getStat("Match overview", "Expected goals"),
            totalShots: getStat("Match overview", "Total shots"),
            goalkeeperSaves: getStat("Match overview", "Goalkeeper saves"),
            cornerKicks: getStat("Match overview", "Corner kicks"),
            fouls: getStat("Match overview", "Fouls"),
            passes: getStat("Match overview", "Passes"),
            tackles: getStat("Match overview", "Tackles"),
            freeKicks: getStat("Match overview", "Free kicks"),
            yellowCards: getStat("Match overview", "Yellow cards"),
            redCards: getStat("Match overview", "Red cards"),
            shots: {
                totalShots: getStat("Shots", "Total shots"),
                shotsOnTarget: getStat("Shots", "Shots on target"),
                hitWoodwork: getStat("Shots", "Hit woodwork"),
                shotsOffTarget: getStat("Shots", "Shots off target"),
                blockedShots: getStat("Shots", "Blocked shots"),
                shotsInsideBox: getStat("Shots", "Shots inside box"),
                shotsOutsideBox: getStat("Shots", "Shots outside box"),
            },
            attack: {
                bigChancesScored: getStat("Attack", "Big chances scored"),
                bigChancesMissed: getStat("Attack", "Big chances missed"),
                throughBalls: getStat("Attack", "Through balls"),
                touchesInPenaltyArea: getStat("Attack", "Touches in penalty area"),
                fouledInFinalThird: getStat("Attack", "Fouled in final third"),
                offsides: getStat("Attack", "Offsides"),
            },
            passesDetails: {
                accuratePasses: getStat("Passes", "Accurate passes"),
                throwIns: getStat("Passes", "Throw-ins"),
                finalThirdEntries: getStat("Passes", "Final third entries"),
                finalThirdPhase: getStat("Passes", "Final third phase"),
                longBalls: getStat("Passes", "Long balls"),
                crosses: getStat("Passes", "Crosses"),
            },
            duels: {
                duels: getStat("Duels", "Duels"),
                dispossessed: getStat("Duels", "Dispossessed"),
                groundDuels: getStat("Duels", "Ground duels"),
                aerialDuels: getStat("Duels", "Aerial duels"),
                dribbles: getStat("Duels", "Dribbles"),
            },
            defending: {
                tacklesWon: getStat("Defending", "Tackles won"),
                totalTackles: getStat("Defending", "Total tackles"),
                interceptions: getStat("Defending", "Interceptions"),
                recoveries: getStat("Defending", "Recoveries"),
                clearances: getStat("Defending", "Clearances"),
                errorsLeadingToShot: getStat("Defending", "Errors lead to a shot"),
                errorsLeadingToGoal: getStat("Defending", "Errors lead to a goal"),
            },
            goalkeeping: {
                totalSaves: getStat("Goalkeeping", "Total saves"),
                goalsPrevented: getStat("Goalkeeping", "Goals prevented"),
                bigSaves: getStat("Goalkeeping", "Big saves"),
                punches: getStat("Goalkeeping", "Punches"),
                goalKicks: getStat("Goalkeeping", "Goal kicks"),
            },
        } as RecentFormStatistics;
    }
}
