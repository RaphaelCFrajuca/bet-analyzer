import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
import { Event } from "../../providers/interfaces/events-list.interface";
import { RecentFormStatistics } from "../interfaces/recent-form-statistics.interface";

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
    }
}
