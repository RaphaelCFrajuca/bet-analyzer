import { MatchService } from "src/match/service/match.service";
import { OpenAiConfig } from "./openai/interfaces/openai.config.interface";
import { RedisConfig } from "./openai/interfaces/redis.config.interface";
import { OpenAiProvider } from "./openai/openai.provider";

export function aiProviderFactory(providerName: AiProvider, openAiConfig: OpenAiConfig, matchService: MatchService, redisConfig: RedisConfig) {
    switch (providerName) {
        case AiProvider.OPENAI:
            return new OpenAiProvider(openAiConfig, matchService, redisConfig);

        default:
            throw new Error(`Unknown ai provider: ${String(providerName)}`);
    }
}

enum AiProvider {
    OPENAI = "openai",
}
