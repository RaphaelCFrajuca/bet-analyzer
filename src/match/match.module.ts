import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { EnvironmentModule } from "src/environment/environment.module";
import { PerformanceModule } from "src/performance/performance.module";
import { DataProvidersModule } from "src/providers/data-providers.module";
import { MatchController } from "./controller/match.controller";
import { MatchService } from "./service/match.service";

@Module({
    imports: [AuthModule, EnvironmentModule, DataProvidersModule, PerformanceModule, DatabaseModule],
    controllers: [MatchController],
    providers: [MatchService],
    exports: [MatchService],
})
export class MatchModule {}
