import { Inject } from "@nestjs/common";
import { utcToZonedTime } from "date-fns-tz";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";

export class SyncService {
    constructor(
        private readonly matchService: MatchService,
        @Inject("AI_SERVICE") private readonly aiService: AiInterface,
    ) {}

    async syncAllData(): Promise<void> {
        console.log(
            "Syncing all matches for day ",
            utcToZonedTime(new Date(Date.now() + 24 * 60 * 60 * 1000), "America/Sao_Paulo")
                .toISOString()
                .split("T")[0],
        );
        const matches: Match[] = await this.matchService.getMatch(
            utcToZonedTime(new Date(Date.now() + 24 * 60 * 60 * 1000), "America/Sao_Paulo")
                .toISOString()
                .split("T")[0],
            true,
        );

        await this.aiService.syncBettingSuggestionsByMatch(matches);
        console.log("Sync batched successfully.");
    }
}
