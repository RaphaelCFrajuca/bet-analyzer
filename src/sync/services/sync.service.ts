import { Inject } from "@nestjs/common";
import { utcToZonedTime } from "date-fns-tz";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { MatchService } from "src/match/service/match.service";

export class SyncService {
    constructor(
        private readonly matchService: MatchService,
        @Inject("AI_SERVICE") private readonly aiService: AiInterface,
    ) {}

    async syncAllData() {
        const matches = await this.matchService.getMatch(utcToZonedTime(new Date(), "America/Sao_Paulo").toISOString().split("T")[0], true);
    }
}
