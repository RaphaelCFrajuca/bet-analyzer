import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import Redis from "ioredis";
import pLimit from "p-limit";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { BettingResponse } from "src/ai/interfaces/betting-response.interface";
import { BettingSuggestions } from "src/ai/interfaces/betting-suggestions.interface";
import { BettingVerifiedResponse } from "src/ai/interfaces/betting-verified.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";
import { BatchBettingResponse } from "../openai/interfaces/batch-betting-response.interface";
import { RedisConfig } from "../openai/interfaces/redis.config.interface";
import { bettingResponseSchema } from "./schemas/betting-suggestion.schema";

export class GoogleProvider implements AiInterface {
    private geminiAi: GoogleGenAI;
    private model = "gemini-2.5-pro-exp-03-25";
    private redis: Redis;

    constructor(
        private readonly matchService: MatchService,
        private readonly redisConfig: RedisConfig,
    ) {
        this.geminiAi = new GoogleGenAI({
            vertexai: true,
            project: "bet-analyzer-457604",
            location: "global",
        });

        this.redis = new Redis({
            host: this.redisConfig.host,
            port: this.redisConfig.port,
            password: this.redisConfig.password,
            username: this.redisConfig.user,
        });
    }

    async getBettingSuggestions(date: string, live: boolean): Promise<BettingSuggestions[]> {
        const cachedSuggestions = await this.redis.get(`betting_suggestions_${date}`);

        if (cachedSuggestions && !live) {
            console.log(`Cache hit for date: ${date}`);
            return JSON.parse(cachedSuggestions) as BettingSuggestions[];
        }

        console.log(`Cache miss for date: ${date}`);
        const limit = pLimit(5);
        const matches = await this.matchService.getMatch(date, live);
        const suggestions = await Promise.all(
            matches.map(match =>
                limit(async () => {
                    const bettingResponse = await this.getBettingSuggestionsByMatch(
                        { ...match, actualHomeScore: undefined, actualAwayScore: undefined, actualMatchStatistics: undefined, status: undefined },
                        live,
                    );
                    await this.redis.set(`betting_response_${match.id}`, JSON.stringify(bettingResponse), "EX", 259200);
                    return {
                        matchId: match.id,
                        date: match.date,
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                        leagueName: match.tournament,
                        bettingSuggestions: bettingResponse.suggestions,
                    } as BettingSuggestions;
                }),
            ),
        );

        return suggestions;
    }
    async getBettingSuggestionsByMatch(match: Match, live: boolean): Promise<BettingResponse> {
        const cachedBettingResponse = await this.redis.get(`betting_response_${match.id}`);
        if (cachedBettingResponse && !live) {
            console.log(`Cache hit for match.id: ${match.id}`);
            return JSON.parse(cachedBettingResponse) as BettingResponse;
        }
        console.log(`Cache miss for match.id: ${match.id}`);

        const chat = this.createChatSession();

        const response = await chat.sendMessage({
            message: [
                {
                    text: JSON.stringify(match),
                },
            ],
        });

        const message = this.parseBettingResponse(response);
        return message;
    }
    private parseBettingResponse(response: GenerateContentResponse) {
        return JSON.parse(response.text as string) as BettingResponse;
    }

    private createChatSession() {
        return this.geminiAi.chats.create({
            model: this.model,
            config: {
                temperature: 0,
                topP: 1,
                seed: 0,
                responseModalities: ["TEXT"],
                responseSchema: bettingResponseSchema,
                responseMimeType: "application/json",
            },
        });
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
