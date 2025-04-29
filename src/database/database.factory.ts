import { Database } from "./providers/interfaces/database.interface";
import { PostgresqlConfig } from "./providers/postgresql/interfaces/postgresql-config.interface";
import { PostgresqlProvider } from "./providers/postgresql/postgresql.provider";

export function databaseFactory(database: string, config: PostgresqlConfig): Database {
    switch (database) {
        case "postgresql":
            return new PostgresqlProvider(config);
        default:
            throw new Error(`Database ${database} not supported`);
    }
}
