import { Module } from "@nestjs/common";
import { EnvironmentModule } from "src/environment/environment.module";
import { dataProviderFactory } from "./data-providers.factory";

@Module({
    imports: [EnvironmentModule],
    controllers: [],
    providers: [
        {
            provide: "DATA_PROVIDER",
            inject: ["PROVIDER", "SOFASCORE_CONFIG"],
            useFactory: dataProviderFactory,
        },
    ],
    exports: ["DATA_PROVIDER"],
})
export class DataProvidersModule {}
