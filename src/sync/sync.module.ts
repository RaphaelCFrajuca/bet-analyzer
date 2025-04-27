import { Module } from "@nestjs/common";
import { AiModule } from "src/ai/ai.module";
import { MatchModule } from "src/match/match.module";
import { SyncController } from "./controllers/sync.controller";
import { SyncService } from "./services/sync.service";

@Module({
    imports: [AiModule, MatchModule],
    controllers: [SyncController],
    providers: [SyncService],
    exports: [],
})
export class SyncModule {}
