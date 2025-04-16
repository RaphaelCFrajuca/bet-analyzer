import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SofascoreConfig } from "src/providers/sofascore/interfaces/sofascore-config.interface";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ".env" })],
    controllers: [],
    providers: [
        {
            provide: "SOFASCORE_CONFIG",
            useValue: {
                apiUrl: process.env.SOFASCORE_PROVIDER_API_URL,
            } as SofascoreConfig,
        },
        {
            provide: "DATA_PROVIDER",
            useValue: process.env.PROVIDER,
        },
    ],
    exports: ["SOFASCORE_CONFIG", "DATA_PROVIDER"],
})
export class EnvironmentModule {}
