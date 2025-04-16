import { Injectable } from "@nestjs/common";
import { DataProviderInterface } from "../interfaces/data-providers.interface";
import { SofascoreConfig } from "./interfaces/sofascore-config.interface";

@Injectable()
export class SofascoreProvider implements DataProviderInterface {
    constructor(private readonly config: SofascoreConfig) {}

    getConfig(): SofascoreConfig {
        return this.config;
    }
}
