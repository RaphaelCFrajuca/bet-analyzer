import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
    ) {}

    getMatch(day: string): string {
        console.log(this.dataProvider.getConfig());
        return day;
    }
}
