import { Controller, Get, Inject, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { getActualDate } from "src/utils/get-actual-date";
import { GetSuggestionsDataDto } from "../dtos/get-suggestions-data.dto";
import { GetSuggestionsEventDto } from "../dtos/get-suggestions-event.dto";
import { AiInterface } from "../interfaces/ai.interface";

@Controller("ai")
@UseGuards(AuthGuard)
export class AiController {
    constructor(@Inject("AI_SERVICE") private readonly aiService: AiInterface) {}

    @Get("betting/suggestions/live/today")
    async getActualBettingSuggestionsByActualDate() {
        const date = new Date();
        return this.aiService.getBettingSuggestions(date.toISOString().split("T")[0], true);
    }

    @Get("betting/suggestions/live/:suggestionsDate")
    async getActualBettingSuggestions(@Param() params: GetSuggestionsDataDto) {
        return this.aiService.getBettingSuggestions(params.suggestionsDate.toISOString().split("T")[0], true);
    }

    @Get("betting/suggestions/:suggestionsDate")
    async getBettingSuggestions(@Param() params: GetSuggestionsDataDto) {
        return this.aiService.getBettingSuggestions(params.suggestionsDate.toISOString().split("T")[0], false);
    }

    @Get("betting/suggestions/event/live/:eventId")
    async getAcualBettingSuggestionsByEventId(@Param() params: GetSuggestionsEventDto) {
        return this.aiService.getBettingSuggestionsByEventId(params.eventId, true);
    }

    @Get("betting/suggestions/event/:eventId")
    async getBettingSuggestionsByEventId(@Param() params: GetSuggestionsEventDto) {
        return this.aiService.getBettingSuggestionsByEventId(params.eventId, false);
    }

    @Get("betting/suggestions")
    async getBettingSuggestionsByActualDate() {
        return this.aiService.getBettingSuggestions(getActualDate(), false);
    }

    @Get("betting/verify/event/:eventId")
    async getBettingVerifiedByEventId(@Param() params: GetSuggestionsEventDto) {
        return this.aiService.getBettingVerifiedByEventId(params.eventId, false);
    }

    @Get("betting/leverage/:suggestionsDate")
    async getBettingLeverageSuggestions(@Param() params: GetSuggestionsDataDto) {
        return this.aiService.getBettingLeverageSuggestions(params.suggestionsDate.toISOString().split("T")[0]);
    }
}
