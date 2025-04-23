/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import pLimit from "p-limit";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { BettingResponse } from "src/ai/interfaces/betting-response.interface";
import { BettingSuggestions } from "src/ai/interfaces/betting-suggestions.interface";
import { BettingVerifiedResponse } from "src/ai/interfaces/betting-verified.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";
import { OpenAiConfig } from "./interfaces/openai.config.interface";
import { RedisConfig } from "./interfaces/redis.config.interface";

@Injectable()
export class OpenAiProvider implements AiInterface {
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

    async getBettingSuggestionsByEventId(eventId: number, live: boolean): Promise<BettingResponse> {
        const match = await this.matchService.getMatchByEventId(eventId, live);
        if (!match) throw new NotFoundException("Match not found.");
        return await this.getBettingSuggestionsByMatch(match, live);
    }

    async getBettingSuggestions(date: string, live: boolean): Promise<BettingSuggestions[]> {
        const cachedSuggestions = await this.redis.get(`betting_suggestions_${date}`);

        if (cachedSuggestions && live) {
            console.log(`Cache hit for date: ${date}`);
            return JSON.parse(cachedSuggestions) as BettingSuggestions[];
        }

        console.log(`Cache miss for date: ${date}`);
        const limit = pLimit(10);
        const matches: Match[] = await this.matchService.getMatch(date, false);
        const suggestions = await Promise.all(
            matches.map(match =>
                limit(async () => {
                    const bettingResponse = await this.getBettingSuggestionsByMatch(match, live);
                    await this.redis.set(`betting_response_${match.id}`, JSON.stringify(bettingResponse), "EX", 86400);
                    return {
                        date: match.date,
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                        leagueName: match.tournament,
                        bettingSuggestions: bettingResponse.suggestions,
                    } as BettingSuggestions;
                }),
            ),
        );

        await this.redis.set(`betting_suggestions_${date}`, JSON.stringify(suggestions), "EX", 86400);
        return suggestions;
    }

    async getBettingSuggestionsByMatch(match: Match, live: boolean): Promise<BettingResponse> {
        const cachedBettingResponse = await this.redis.get(`betting_response_${match.id}`);
        if (cachedBettingResponse && !live) {
            console.log(`Cache hit for match.id: ${match.id}`);
            return JSON.parse(cachedBettingResponse) as BettingResponse;
        }
        console.log(`Cache miss for match.id: ${match.id}`);

        const thread = await this.generateThread(match);
        return (await this.getMessage(thread)) as BettingResponse;
    }

    async getBettingVerifiedByEventId(eventId: number, live: boolean): Promise<BettingVerifiedResponse> {
        const cachedBettingVeridiedResponse = await this.redis.get(`betting_verified_response_${eventId}`);
        if (cachedBettingVeridiedResponse && !live) {
            console.log(`Cache hit for eventId: ${eventId}`);
            return JSON.parse(cachedBettingVeridiedResponse) as BettingVerifiedResponse;
        }
        console.log(`Cache miss for eventId: ${eventId}`);

        const match = await this.matchService.getMatchByEventId(eventId, live);
        const bettingSuggestions = await this.getBettingSuggestionsByMatch(match, live);
        match.bettingSuggestions = bettingSuggestions.suggestions;

        if (!match) throw new NotFoundException("Match not found.");

        const thread = await this.generateThread(match);
        return (await this.getMessage(thread, this.openAiConfig.greenAssistantId)) as BettingVerifiedResponse;
    }

    private async getMessage(thread: OpenAI.Beta.Threads.Thread, assistantId?: string): Promise<BettingResponse | BettingVerifiedResponse> {
        let run = await this.runThread(thread, assistantId);

        while (run.status !== "completed") {
            console.log(`${run.status} - ${run.last_error?.message} retrying... in 10 seconds`);
            await new Promise(resolve => setTimeout(resolve, 10000));
            run = await this.runThread(thread, assistantId);
        }

        const messages = await this.openAi.beta.threads.messages.list(thread.id);

        const assistantMessage = messages.data.find(message => message.role === "assistant")?.content[0] as TextContentBlock;
        const messageParsed = assistantMessage?.text?.value;
        if (!messageParsed) {
            throw new InternalServerErrorException("Failed to parse assistant message.");
        }
        const parsedResponse = JSON.parse(assistantMessage?.text?.value) as BettingResponse | BettingVerifiedResponse;
        return parsedResponse;
    }

    private async runThread(thread: OpenAI.Beta.Threads.Thread, assistantId?: string): Promise<Run> {
        return await this.openAi.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantId ? assistantId : this.openAiConfig.assistantId,
        });
    }

    private async generateThread(match: Match): Promise<Thread> {
        try {
            return await this.openAi.beta.threads.create({
                messages: [
                    {
                        role: "user",
                        content: JSON.stringify(match),
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Failed to generate thread.");
        }
    }
}
