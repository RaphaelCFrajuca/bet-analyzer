import { OpenAiConfig } from "./interfaces/openai.config.interface";

export class OpenAiProvider {
    constructor(private readonly openAiConfig: OpenAiConfig) {}
}
