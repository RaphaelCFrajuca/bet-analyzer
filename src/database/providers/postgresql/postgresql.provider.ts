import { DataSource } from "typeorm";
import { Database } from "../interfaces/database.interface";
import { Auth } from "./entities/auth.entity";
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
            entities: [Auth],
            synchronize: true,
            logging: false,
        });
    }

    findById(id: string): Promise<Auth | null> {
        throw new Error("Method not implemented.");
    }
    findByUsername(username: string): Promise<Auth | null> {
        throw new Error("Method not implemented.");
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
