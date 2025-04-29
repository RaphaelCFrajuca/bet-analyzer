import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { EnvironmentModule } from "src/environment/environment.module";
import { MatchModule } from "src/match/match.module";
import { MatchService } from "src/match/service/match.service";
import { AiController } from "./controllers/ai.controller";
import { aiProviderFactory } from "./providers/provider.factory";

@Module({
    imports: [AuthModule, EnvironmentModule, MatchModule],
    controllers: [AiController],
    providers: [
        {
            provide: "AI_SERVICE",
            inject: ["AI_PROVIDER", "OPENAI_PROVIDER_CONFIG", MatchService, "REDIS_CONFIG"],
            useFactory: aiProviderFactory,
        },
    ],
    exports: ["AI_SERVICE"],
})
export class AiModule {}
