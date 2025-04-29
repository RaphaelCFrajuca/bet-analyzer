import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import OpenAI, { toFile } from "openai";
import { Response } from "openai/core";
import { Batch } from "openai/resources/batches";
import { TextContentBlock } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { FileObject } from "openai/resources/files";
import pLimit from "p-limit";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { BettingResponse } from "src/ai/interfaces/betting-response.interface";
import { BettingSuggestions } from "src/ai/interfaces/betting-suggestions.interface";
import { BettingVerifiedResponse } from "src/ai/interfaces/betting-verified.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";
import { getActualDate } from "src/utils/get-actual-date";
import { BatchBettingResponse } from "./interfaces/batch-betting-response.interface";
import { BatchResponseItem } from "./interfaces/batch-response-item.interface";
import { OpenAiConfig } from "./interfaces/openai.config.interface";
import { RedisConfig } from "./interfaces/redis.config.interface";
import { bettingSuggestionPrompt } from "./prompts/betting-suggestion.prompt";
import { bettingResponseSchema } from "./schemas/betting-suggestion.schema";

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

        if (cachedSuggestions && !live) {
            console.log(`Cache hit for date: ${date}`);
            return JSON.parse(cachedSuggestions) as BettingSuggestions[];
        }

        if ((await this.verifySync()).length === 0 && getActualDate() === date && (await this.redis.get("actual_batch_date")) === date) {
            console.log("Daily sync not completed yet. Please try again later.");
            return [] as BettingSuggestions[];
        }

        console.log(`Cache miss for date: ${date}`);
        const limit = pLimit(10);
        const matches: Match[] = await this.matchService.getMatch(date, false);
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

        const thread = await this.generateThread(match);
        const bettingResponse = (await this.getMessage(thread)) as BettingResponse;
        await this.redis.set(`betting_response_${match.id}`, JSON.stringify(bettingResponse), "EX", 259200);
        return bettingResponse;
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

        const thread = await this.generateThread(match);
        const bettingVerifiedResponse = (await this.getMessage(thread, this.openAiConfig.greenAssistantId)) as BettingVerifiedResponse;
        await this.redis.set(`betting_verified_response_${eventId}`, JSON.stringify(bettingVerifiedResponse), "EX", 259200);
        return bettingVerifiedResponse;
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

    async syncBettingSuggestionsByMatch(matches: Match[], date: string): Promise<void> {
        const file: FileObject = await this.uploadMatchesToOpenAI(matches);
        const batch: Batch = await this.initializeChatCompletionBatch(file);

        await this.redis.set(`actual_batch`, batch.id, "EX", 259200);
        await this.redis.set("actual_batch_date", date, "EX", 259200);
    }

    async verifySync(): Promise<BatchBettingResponse[]> {
        const batchId = await this.redis.get(`actual_batch`);
        if (!batchId) throw new NotFoundException("Batch not found.");

        const batch = await this.getBatchById(batchId);
        if (!batch) throw new NotFoundException("Batch not found.");

        if (batch.status === "completed") {
            const parsedSuggestions = await this.retrieveAndParseSuggestions(batch);
            return parsedSuggestions;
        } else if (batch.status === "failed") {
            console.error(batch.errors);
            throw new InternalServerErrorException("Batch failed.");
        } else {
            console.log(`Batch status: ${batch.status}. (${batch.request_counts?.completed}/${batch.request_counts?.total}) Waiting for completion...`);
            return [] as BatchBettingResponse[];
        }
    }

    private async retrieveAndParseSuggestions(batch: OpenAI.Batches.Batch): Promise<BatchBettingResponse[]> {
        const file: FileObject = await this.openAi.files.retrieve(batch.output_file_id!);
        const lines = await this.getFileLines(file);
        const parsedSugestions: BatchBettingResponse[] = this.extractBettingResponses(lines);
        return parsedSugestions;
    }

    private async getFileLines(file: OpenAI.Files.FileObject) {
        const fileResponse: Response = await this.openAi.files.content(file.id);
        const fileContent: string = await fileResponse.text();

        const lines = fileContent.split("\n").filter(line => line.trim() !== "");
        return lines;
    }

    private extractBettingResponses(lines: string[]): BatchBettingResponse[] {
        return lines.map(line => {
            const suggestion = JSON.parse((JSON.parse(line) as BatchResponseItem).response?.body.choices[0].message.content ?? "{}") as BettingResponse;
            return { matchId: Number((JSON.parse(line) as BatchResponseItem).custom_id), bettingResponse: suggestion };
        });
    }

    private async getBatchById(batchId: string): Promise<Batch> {
        const batch = await this.openAi.batches.retrieve(batchId);
        if (!batch) throw new NotFoundException("Batch not found.");
        return batch;
    }

    private async initializeChatCompletionBatch(file: OpenAI.Files.FileObject & { _request_id?: string | null }) {
        return await this.openAi.batches.create({
            completion_window: "24h",
            endpoint: "/v1/chat/completions",
            input_file_id: file.id,
        });
    }

    private async uploadMatchesToOpenAI(matches: Match[]) {
        return await this.openAi.files.create({
            file: await toFile(new Blob([this.generateMatchesJsonLine(matches)], { type: "application/jsonl" }), "matches.jsonl"),
            purpose: "batch",
        });
    }

    generateMatchesJsonLine(matches: Match[]): string {
        const matchesJsonl = matches.map(match => {
            const matchJson: string = JSON.stringify(match, null, 2);
            return {
                custom_id: String(match.id),
                method: "POST",
                url: "/v1/chat/completions",
                body: {
                    model: "gpt-4.1-mini",
                    messages: [
                        {
                            role: "system",
                            content: bettingSuggestionPrompt,
                        },
                        {
                            role: "user",
                            content: matchJson,
                        },
                    ],
                    response_format: {
                        type: "json_schema",
                        json_schema: bettingResponseSchema,
                    },
                    temperature: 0.0,
                    top_p: 1,
                },
            };
        });
        return matchesJsonl.map(line => JSON.stringify(line)).join("\n");
    }
}
