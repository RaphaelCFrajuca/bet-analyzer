import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisConfig } from "src/ai/providers/openai/interfaces/redis.config.interface";
import { PostgresqlConfig } from "src/database/providers/postgresql/interfaces/postgresql-config.interface";
import { SofascoreConfig } from "src/providers/sofascore/interfaces/sofascore-config.interface";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
    controllers: [],
    providers: [
        {
            provide: "REDIS_CONFIG",
            useValue: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
                user: process.env.REDIS_USER,
            } as unknown as RedisConfig,
        },
        {
            provide: "SOFASCORE_CONFIG",
            useValue: {
                apiUrl: process.env.SOFASCORE_PROVIDER_API_URL,
            } as SofascoreConfig,
        },
        {
            provide: "PROVIDER",
            useValue: process.env.PROVIDER,
        },
        {
            provide: "AI_PROVIDER",
            useValue: process.env.AI_PROVIDER,
        },
        {
            provide: "OPENAI_PROVIDER_CONFIG",
            useValue: {
                apiKey: process.env.OPENAI_API_KEY,
                assistantId: process.env.OPENAI_ASSISTANT_ID,
                greenAssistantId: process.env.OPENAI_GREEN_ASSISTANT_ID,
            },
        },
        {
            provide: "JWT_TOKEN_SECRET",
            useValue: process.env.JWT_TOKEN_SECRET,
        },
        {
            provide: "POSTGRESQL_CONFIG",
            useValue: {
                host: process.env.POSTGRESQL_HOST,
                port: parseInt(process.env.POSTGRESQL_PORT!, 10),
                user: process.env.POSTGRESQL_USER,
                password: process.env.POSTGRESQL_PASSWORD,
                database: process.env.POSTGRESQL_DATABASE,
            } as unknown as PostgresqlConfig,
        },
    ],
    exports: ["REDIS_CONFIG", "SOFASCORE_CONFIG", "PROVIDER", "AI_PROVIDER", "OPENAI_PROVIDER_CONFIG", "JWT_TOKEN_SECRET", "POSTGRESQL_CONFIG"],
})
export class EnvironmentModule {}
