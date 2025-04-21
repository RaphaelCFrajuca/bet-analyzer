import { Controller, Get, Inject, Param } from "@nestjs/common";
import { GetSuggestionsDataDto } from "../dtos/get-suggestions-data.dto";
import { AiInterface } from "../interfaces/ai.interface";

@Controller("ai")
export class AiController {
    constructor(@Inject("AI_SERVICE") private readonly aiService: AiInterface) {}

    @Get("betting/suggestions/:suggestionsDate")
    async getBettingSuggestions(@Param() params: GetSuggestionsDataDto) {
        return this.aiService.getBettingSuggestions(params.suggestionsDate.toISOString().split("T")[0]);
    }
}
