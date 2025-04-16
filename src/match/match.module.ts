import { Module } from "@nestjs/common";
import { DataProvidersModule } from "src/providers/data-providers.module";
import { MatchController } from "./controller/match.controller";
import { MatchService } from "./service/match.service";

@Module({
    imports: [DataProvidersModule],
    controllers: [MatchController],
    providers: [MatchService],
})
export class MatchModule {}
