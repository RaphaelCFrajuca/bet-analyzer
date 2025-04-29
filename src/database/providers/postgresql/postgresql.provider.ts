import { DataSource } from "typeorm";
import { Database } from "../interfaces/database.interface";
import { PostgresqlConfig } from "./interfaces/postgresql-config.interface";

export class PostgresqlProvider implements Database {
    private dataSource: DataSource;
    constructor(private readonly postgresqlConfig: PostgresqlConfig) {
        this.dataSource = new DataSource({
            type: "postgres",
            host: this.postgresqlConfig.host,
            port: this.postgresqlConfig.port,
            username: this.postgresqlConfig.user,
            password: this.postgresqlConfig.password,
            database: this.postgresqlConfig.database,
            synchronize: true,
            logging: false,
        });
    }

    async connect(): Promise<DataSource> {
        return await this.dataSource.initialize();
    }
    async disconnect(): Promise<void> {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }
}
