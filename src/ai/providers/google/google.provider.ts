import Redis from "ioredis";
import OpenAI from "openai";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { BettingResponse } from "src/ai/interfaces/betting-response.interface";
import { BettingSuggestions } from "src/ai/interfaces/betting-suggestions.interface";
import { BettingVerifiedResponse } from "src/ai/interfaces/betting-verified.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";
import { BatchBettingResponse } from "../openai/interfaces/batch-betting-response.interface";
import { OpenAiConfig } from "../openai/interfaces/openai.config.interface";
import { RedisConfig } from "../openai/interfaces/redis.config.interface";

export class GoogleProvider implements AiInterface {
    private openAi: OpenAI;
    private redis: Redis;

    constructor(
        private readonly openAiConfig: OpenAiConfig,
        private readonly matchService: MatchService,
        private readonly redisConfig: RedisConfig,
    ) {
        this.openAi = new OpenAI({
            apiKey: openAiConfig.apiKey,
        });
        this.redis = new Redis({
            host: this.redisConfig.host,
            port: this.redisConfig.port,
            password: this.redisConfig.password,
            username: this.redisConfig.user,
        });
    }

    getBettingSuggestions(date: string, live: boolean): Promise<BettingSuggestions[]> {
        throw new Error("Method not implemented.");
    }
    getBettingSuggestionsByMatch(match: Match, live: boolean): Promise<BettingResponse> {
        throw new Error("Method not implemented.");
    }
    getBettingSuggestionsByEventId(eventId: number, live: boolean): Promise<BettingResponse> {
        throw new Error("Method not implemented.");
    }
    getBettingVerifiedByEventId(eventId: number, live: boolean): Promise<BettingVerifiedResponse> {
        throw new Error("Method not implemented.");
    }
    syncBettingSuggestionsByMatch(matches: Match[], date: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    verifySync(): Promise<BatchBettingResponse[]> {
        throw new Error("Method not implemented.");
    }
}
