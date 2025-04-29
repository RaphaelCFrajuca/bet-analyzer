import { Database } from "./providers/interfaces/database.interface";
import { PostgresqlConfig } from "./providers/postgresql/interfaces/postgresql-config.interface";
import { PostgresqlProvider } from "./providers/postgresql/postgresql.provider";

export function databaseFactory(database: DatabaseProvider, config: PostgresqlConfig): Database {
    switch (database) {
        case DatabaseProvider.POSTGRESQL:
            return new PostgresqlProvider(config);
        default:
            throw new Error(`Database ${String(database)} not supported`);
    }
}

enum DatabaseProvider {
    POSTGRESQL = "postgresql",
}
