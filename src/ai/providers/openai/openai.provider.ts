/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import pLimit from "p-limit";
import { AiInterface } from "src/ai/interfaces/ai.interface";
import { BettingResponse } from "src/ai/interfaces/betting-response.interface";
import { BettingSuggestions } from "src/ai/interfaces/betting-suggestions.interface";
import { Match } from "src/match/interfaces/match.interface";
import { MatchService } from "src/match/service/match.service";
import { OpenAiConfig } from "./interfaces/openai.config.interface";

@Injectable()
export class OpenAiProvider implements AiInterface {
    private openAi: OpenAI;

    constructor(
        private readonly openAiConfig: OpenAiConfig,
        private readonly matchService: MatchService,
    ) {
        this.openAi = new OpenAI({
            apiKey: openAiConfig.apiKey,
        });
    }

    async getBettingSuggestionsByEventId(eventId: number): Promise<BettingResponse> {
        const match = await this.matchService.getMatchByEventId(eventId);
        if (!match) throw new NotFoundException("Match not found.");
        return await this.getBettingSuggestionsByMatch(match);
    }

    async getBettingSuggestions(date: string): Promise<BettingSuggestions[]> {
        const limit = pLimit(10);
        const matches: Match[] = await this.matchService.getMatch(date);
        return await Promise.all(
            matches.map(match =>
                limit(async () => {
                    const bettingResponse = await this.getBettingSuggestionsByMatch(match);
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
    }

    async getBettingSuggestionsByMatch(match: Match): Promise<BettingResponse> {
        const thread = await this.generateThread(match);
        let run = await this.runThread(thread);

        while (run.status === "failed" && run.last_error?.code === "rate_limit_exceeded") {
            console.log("Rate limit exceeded. Retrying in 10 seconds...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            run = await this.runThread(thread);
        }

        try {
            const parsedResponse: BettingResponse = await this.getMessage(thread);

            return parsedResponse;
        } catch (error) {
            console.log("Error getting message:", match.id);
            console.log(run);
            console.error(error);
            throw new InternalServerErrorException("Failed to get message from thread.", thread.id);
        }
    }

    private async getMessage(thread: OpenAI.Beta.Threads.Thread) {
        const messages = await this.openAi.beta.threads.messages.list(thread.id);

        const assistantMessage = messages.data.find(message => message.role === "assistant")?.content[0] as TextContentBlock;
        const messageParsed = assistantMessage?.text?.value;
        if (!messageParsed) {
            throw new InternalServerErrorException("Failed to parse assistant message.");
        }
        const parsedResponse = JSON.parse(assistantMessage?.text?.value) as BettingResponse;
        return parsedResponse;
    }

    private async runThread(thread: OpenAI.Beta.Threads.Thread): Promise<Run> {
        return await this.openAi.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: this.openAiConfig.assistantId,
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
