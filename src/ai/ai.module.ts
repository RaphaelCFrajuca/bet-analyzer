import { Module } from "@nestjs/common";
import { EnvironmentModule } from "src/environment/environment.module";
import { AiController } from "./controllers/ai.controller";
import { aiProviderFactory } from "./providers/provider.factory";

@Module({
    imports: [EnvironmentModule],
    controllers: [AiController],
    providers: [
        {
            provide: "AI_SERVICE",
            inject: ["AI_PROVIDER", "OPENAI_PROVIDER_CONFIG"],
            useFactory: aiProviderFactory,
        },
    ],
    exports: [],
})
export class AiModule {}
