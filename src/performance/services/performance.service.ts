import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";
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
                    tournament: event.tournament.name,
                    ballPossession: {
                        home: statistics.statistics[0].groups[0].statisticsItems[0].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[0].away,
                    },
                    expectedGoals: {
                        home: statistics.statistics[0].groups[0].statisticsItems[1].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[1].away,
                    },
                    totalShots: {
                        home: statistics.statistics[0].groups[0].statisticsItems[2].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[2].away,
                    },
                    goalkeeperSaves: {
                        home: statistics.statistics[0].groups[0].statisticsItems[3].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[3].away,
                    },
                    cornerKicks: {
                        home: statistics.statistics[0].groups[0].statisticsItems[4].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[4].away,
                    },
                    fouls: {
                        home: statistics.statistics[0].groups[0].statisticsItems[5].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[5].away,
                    },
                    passes: {
                        home: statistics.statistics[0].groups[0].statisticsItems[6].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[6].away,
                    },
                    tackles: {
                        home: statistics.statistics[0].groups[0].statisticsItems[7].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[7].away,
                    },
                    freeKicks: {
                        home: statistics.statistics[0].groups[0].statisticsItems[8].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[8].away,
                    },
                    yellowCards: {
                        home: statistics.statistics[0].groups[0].statisticsItems[9].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[9].away,
                    },
                    redCards: {
                        home: statistics.statistics[0].groups[0].statisticsItems[10].home,
                        away: statistics.statistics[0].groups[0].statisticsItems[10].away,
                    },
                } as RecentFormStatistics;
            }),
        );

        return recentFormStatistics;
    }
}
