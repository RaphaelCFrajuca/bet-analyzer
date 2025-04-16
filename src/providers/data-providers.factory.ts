import { SofascoreConfig } from "./sofascore/interfaces/sofascore-config.interface";
import { SofascoreProvider } from "./sofascore/sofascore.provider";

export function dataProviderFactory(provider: DataProvider, sofascoreConfig: SofascoreConfig) {
    switch (provider) {
        case DataProvider.SOFASCORE:
            return new SofascoreProvider(sofascoreConfig);
        default:
            throw new Error(`Unsupported data provider: ${String(provider)}`);
    }
}

enum DataProvider {
    SOFASCORE = "sofascore",
}
