import { Module } from "@nestjs/common";
import { AiModule } from "src/ai/ai.module";
import { EnvironmentModule } from "src/environment/environment.module";
import { MatchModule } from "src/match/match.module";
import { SyncController } from "./controllers/sync.controller";
import { SyncService } from "./services/sync.service";

@Module({
    imports: [AiModule, MatchModule, EnvironmentModule],
    controllers: [SyncController],
    providers: [SyncService],
    exports: [],
})
export class SyncModule {}
