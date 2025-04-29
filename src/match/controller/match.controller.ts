import { Controller, Get, Injectable, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { getActualDate } from "src/utils/get-actual-date";
import { GetMatchDataDto } from "../dtos/get-match-data.dto";
import { GetMatchEventDto } from "../dtos/get-match-event.dto";
import { MatchService } from "../service/match.service";

@Controller("match")
@Injectable()
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get(":marketDate")
    @UseGuards(AuthGuard)
    getMatch(@Param() params: GetMatchDataDto) {
        return this.matchService.getMatch(params.marketDate.toISOString().split("T")[0], false);
    }

    @Get("live/today")
    @UseGuards(AuthGuard)
    getLiveMatchByActualDate() {
        const date = new Date();
        return this.matchService.getMatch(date.toISOString().split("T")[0], true);
    }

    @Get("live/:marketDate")
    @UseGuards(AuthGuard)
    getLiveMatch(@Param() params: GetMatchDataDto) {
        return this.matchService.getMatch(params.marketDate.toISOString().split("T")[0], true);
    }

    @Get()
    @UseGuards(AuthGuard)
    getMatchByActualDate() {
        return this.matchService.getMatch(getActualDate(), false);
    }

    @Get("event/live/:eventId")
    @UseGuards(AuthGuard)
    getLiveMatchByEventId(@Param() params: GetMatchEventDto) {
        return this.matchService.getMatchByEventId(params.eventId, true);
    }

    @Get("event/:eventId")
    @UseGuards(AuthGuard)
    getMatchByEventId(@Param() params: GetMatchEventDto) {
        return this.matchService.getMatchByEventId(params.eventId, false);
    }

    @Get("team-image/:teamId")
    async getTeamImages(@Param("teamId") teamId: number, @Res() res: Response) {
        const buffer = await this.matchService.getTeamImage(teamId);
        res.setHeader("Content-Type", "image/png");
        res.send(buffer);
    }
}
