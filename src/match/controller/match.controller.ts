import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { GetMatchDataDto } from "../dtos/get-match-data.dto";
import { MatchService } from "../service/match.service";

@Controller("match")
@Injectable()
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get(":marketDate")
    getMatch(@Param() params: GetMatchDataDto) {
        return this.matchService.getMatch(params.marketDate.toISOString().split("T")[0]);
    }

    @Get()
    getMatchByActualDate() {
        const date = new Date();
        return this.matchService.getMatch(date.toISOString().split("T")[0]);
    }
}
