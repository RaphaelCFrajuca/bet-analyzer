import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { GetMatchDataDto } from "../dtos/get-match-data.dto";
import { GetMatchEventDto } from "../dtos/get-match-event.dto";
import { MatchService } from "../service/match.service";

@Controller("match")
@Injectable()
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get(":marketDate")
    getMatch(@Param() params: GetMatchDataDto) {
        return this.matchService.getMatch(params.marketDate.toISOString().split("T")[0], false);
    }

    @Get("live/today")
    getLiveMatchByActualDate() {
        console.log("getLiveMatchByActualDate called");
        const date = new Date();
        return this.matchService.getMatch(date.toISOString().split("T")[0], true);
    }

    @Get("live/:marketDate")
    getLiveMatch(@Param() params: GetMatchDataDto) {
        return this.matchService.getMatch(params.marketDate.toISOString().split("T")[0], true);
    }

    @Get()
    getMatchByActualDate() {
        const date = new Date();
        return this.matchService.getMatch(date.toISOString().split("T")[0], false);
    }

    @Get("event/live/:eventId")
    getLiveMatchByEventId(@Param() params: GetMatchEventDto) {
        return this.matchService.getMatchByEventId(params.eventId, true);
    }

    @Get("event/:eventId")
    getMatchByEventId(@Param() params: GetMatchEventDto) {
        return this.matchService.getMatchByEventId(params.eventId, false);
    }
}
