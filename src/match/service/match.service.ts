import { Inject, Injectable } from "@nestjs/common";
import { DataProviderInterface } from "src/providers/interfaces/data-providers.interface";

@Injectable()
export class MatchService {
    constructor(
        @Inject("DATA_PROVIDER")
        private readonly dataProvider: DataProviderInterface,
    ) {}

    async getMatch(day: string): Promise<any> {
        return await this.dataProvider.getEvents(day);
    }
}
