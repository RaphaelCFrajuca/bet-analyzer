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

    async findById(id: string): Promise<Auth | null> {
        const dataSource = await this.connect();
        const authRepository = dataSource.getRepository(Auth);
        const auth = await authRepository.findOne({ where: { id } });
        if (!auth) return null;
        await this.disconnect();
        return auth;
    }
    async findByUsername(username: string): Promise<Auth | null> {
        const dataSource = await this.connect();
        const authRepository = dataSource.getRepository(Auth);
        const auth = await authRepository.findOne({ where: { username } });
        if (!auth) return null;
        await this.disconnect();
        return auth;
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
