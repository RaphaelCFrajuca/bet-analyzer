import { Module } from "@nestjs/common";
import { EnvironmentModule } from "src/environment/environment.module";
import { databaseFactory } from "./database.factory";

@Module({
    imports: [EnvironmentModule],
    providers: [
        {
            provide: "DATABASE_PROVIDER",
            inject: ["DATABASE", "POSTGRESQL_CONFIG"],
            useFactory: databaseFactory,
        },
    ],
    exports: ["DATABASE_PROVIDER"],
})
export class DatabaseModule {}
