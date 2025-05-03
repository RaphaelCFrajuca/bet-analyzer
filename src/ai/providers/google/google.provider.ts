import { GenerateContentResponse, GoogleGenAI, Schema } from "@google/genai";
import { NotFoundException } from "@nestjs/common";
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
import { bettingVerifiedSchema } from "./schemas/betting-verified.schema";

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
            location: "us-central1",
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

        let response: GenerateContentResponse;
        const chat = this.createChatSession(bettingResponseSchema, this.model);

        while (true) {
            try {
                response = await chat.sendMessage({
                    message: [
                        {
                            text: JSON.stringify(match),
                        },
                    ],
                });
                break;
            } catch (error) {
                if (error instanceof Error && error.message.includes("limit exceeded")) {
                    console.log("Limit exceeded, retrying in 10 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 10000));
                } else {
                    throw error;
                }
            }
        }

        const message = this.parseResponse(response) as BettingResponse;
        await this.redis.set(`betting_response_${match.id}`, JSON.stringify(message), "EX", 259200);
        return message;
    }
    private parseResponse(response: GenerateContentResponse): BettingResponse | BettingVerifiedResponse {
        return JSON.parse(response.text as string) as BettingResponse | BettingVerifiedResponse;
    }

    private createChatSession(schema: Schema, model?: string) {
        return this.geminiAi.chats.create({
            model: model ?? this.model,
            config: {
                temperature: 0,
                topP: 1,
                seed: 0,
                responseModalities: ["TEXT"],
                responseSchema: schema,
                responseMimeType: "application/json",
            },
        });
    }

    async getBettingSuggestionsByEventId(eventId: number, live: boolean): Promise<BettingResponse> {
        const match = await this.matchService.getMatchByEventId(eventId, live);
        if (!match) throw new NotFoundException("Match not found.");
        return await this.getBettingSuggestionsByMatch(match, live);
    }
    async getBettingVerifiedByEventId(eventId: number, live: boolean): Promise<BettingVerifiedResponse> {
        const cachedBettingVeridiedResponse = await this.redis.get(`betting_verified_response_${eventId}`);
        if (cachedBettingVeridiedResponse && !live) {
            console.log(`Cache hit for eventId: ${eventId}`);
            return JSON.parse(cachedBettingVeridiedResponse) as BettingVerifiedResponse;
        }
        console.log(`Cache miss for eventId: ${eventId}`);

        const match = await this.matchService.getMatchByEventId(eventId, true);
        const bettingSuggestions = await this.getBettingSuggestionsByMatch(match, live);
        match.bettingSuggestions = bettingSuggestions.suggestions;

        if (!match) throw new NotFoundException("Match not found.");

        const chat = this.createChatSession(bettingVerifiedSchema, "gemini-2.0-flash");

        const response = await chat.sendMessage({
            message: [
                {
                    text: JSON.stringify(match),
                },
            ],
        });

        const bettingVerifiedResponse = this.parseResponse(response) as BettingVerifiedResponse;
        await this.redis.set(`betting_verified_response_${eventId}`, JSON.stringify(bettingVerifiedResponse), "EX", 259200);
        return bettingVerifiedResponse;
    }
    async syncBettingSuggestionsByMatch(matches: Match[], date: string): Promise<void> {
        await this.getBettingSuggestions(date, true);
    }
    verifySync(): Promise<BatchBettingResponse[]> {
        return Promise.resolve([]);
    }
}
