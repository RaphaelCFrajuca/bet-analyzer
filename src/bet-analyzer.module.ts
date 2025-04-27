import { Module } from "@nestjs/common";
import { AiModule } from "./ai/ai.module";
import { MatchModule } from "./match/match.module";
import { SyncModule } from "./sync/sync.module";

@Module({
    imports: [MatchModule, AiModule, SyncModule],
    controllers: [],
    providers: [],
})
export class BetAnalyzerModule {}
