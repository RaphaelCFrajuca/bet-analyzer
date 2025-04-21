import { Module } from "@nestjs/common";
import { PerformanceModule } from "src/performance/performance.module";
import { DataProvidersModule } from "src/providers/data-providers.module";
import { MatchController } from "./controller/match.controller";
import { MatchService } from "./service/match.service";

@Module({
    imports: [DataProvidersModule, PerformanceModule],
    controllers: [MatchController],
    providers: [MatchService],
    exports: [MatchService],
})
export class MatchModule {}
