import { Module } from "@nestjs/common";
import { MatchController } from "./controller/match.controller";
import { MatchService } from "./service/match.service";

@Module({
    imports: [],
    controllers: [MatchController],
    providers: [MatchService],
})
export class MatchModule {}
