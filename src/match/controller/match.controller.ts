import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { MatchService } from "../service/match.service";

@Controller("match")
@Injectable()
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Get(":day")
    getMatch(@Param("day") day: string): string {
        return this.matchService.getMatch(day);
    }
}
