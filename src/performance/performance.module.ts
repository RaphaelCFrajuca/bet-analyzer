import { Module } from "@nestjs/common";
import { BetAnalyzerModule } from "src/bet-analyzer.module";
import { PerformanceService } from "./services/performance.service";

@Module({
    imports: [BetAnalyzerModule],
    providers: [PerformanceService],
    exports: [PerformanceService],
})
export class PerformanceModule {}
