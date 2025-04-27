import { Inject } from "@nestjs/common";
import { utcToZonedTime } from "date-fns-tz";
import Redis from "ioredis";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { RedisConfig } from "src/ai/providers/openai/interfaces/redis.config.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";

export class SyncService {
    private redis: Redis;

    constructor(
        private readonly matchService: MatchService,
        @Inject("AI_SERVICE") private readonly aiService: AiInterface,
        @Inject("REDIS_CONFIG")
        private readonly redisConfig: RedisConfig,
    ) {
        this.redis = new Redis({
            host: this.redisConfig.host,
            port: this.redisConfig.port,
            password: this.redisConfig.password,
            username: this.redisConfig.user,
        });
    }

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

    async getSync() {
        const matches: Match[] = await this.aiService.verifySync();
        console.log("Matches length: ", matches.length);
        for (const match of matches) {
            await this.redis.set(`match_${match.id}`, JSON.stringify(match), "EX", 259200);
        }
        if (matches.length > 0) return true;
        return false;
    }
}
