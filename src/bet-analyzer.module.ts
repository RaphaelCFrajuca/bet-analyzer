import { Module } from "@nestjs/common";
import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { MatchModule } from "./match/match.module";
import { SyncModule } from "./sync/sync.module";

@Module({
    imports: [AuthModule, MatchModule, AiModule, SyncModule],
})
export class BetAnalyzerModule {}
