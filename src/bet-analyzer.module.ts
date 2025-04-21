import { Module } from "@nestjs/common";
import { AiModule } from "./ai/ai.module";
import { MatchModule } from "./match/match.module";

@Module({
    imports: [MatchModule, AiModule],
    controllers: [],
    providers: [],
})
export class BetAnalyzerModule {}
