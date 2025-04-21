import { OpenAiConfig } from "./openai/interfaces/openai.config.interface";
import { OpenAiProvider } from "./openai/openai.provider";

export function aiProviderFactory(providerName: AiProvider, openAiConfig: OpenAiConfig) {
    switch (providerName) {
        case AiProvider.OPENAI:
            return new OpenAiProvider(openAiConfig);

        default:
            throw new Error(`Unknown ai provider: ${String(providerName)}`);
    }
}

enum AiProvider {
    OPENAI = "openai",
}
