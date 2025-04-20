import { Module } from "@nestjs/common";
import { DataProvidersModule } from "src/providers/data-providers.module";
import { PerformanceService } from "./services/performance.service";

@Module({
    imports: [DataProvidersModule],
    providers: [PerformanceService],
    exports: [PerformanceService],
})
export class PerformanceModule {}
