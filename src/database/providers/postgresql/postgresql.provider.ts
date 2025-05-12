import { DataSource, Repository } from "typeorm";
import { Database } from "../interfaces/database.interface";
import { Auth } from "./entities/auth.entity";
import { MatchEntity } from "./entities/match/match.entity";
import { MatchRefereeEntity } from "./entities/match/match.referee.entity";
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
            entities: [__dirname + "/entities/**/*.{ts,js}"],
            synchronize: true,
            logging: false,
        });
    }

    async createMatch(match: MatchEntity): Promise<MatchEntity> {
        const dataSource = await this.connect();
        const matchRepository: Repository<MatchEntity> = dataSource.getRepository(MatchEntity);
        const refereeRepository: Repository<MatchRefereeEntity> = dataSource.getRepository(MatchRefereeEntity);
        if (match.referee) {
            match.referee = refereeRepository.create(match.referee);
            match.referee = await refereeRepository.save(match.referee);
        }
        const matchCreated = await matchRepository.save(match);
        await this.disconnect();
        return matchCreated;
    }
    async createUser(username: string, password: string): Promise<void> {
        const dataSource = await this.connect();
        const authRepository: Repository<Auth> = dataSource.getRepository(Auth);
        const auth = new Auth();
        auth.username = username;
        auth.password = password;
        await authRepository.save(auth);
        await this.disconnect();
    }

    async findById(id: string): Promise<Auth | null> {
        const dataSource = await this.connect();
        const authRepository: Repository<Auth> = dataSource.getRepository(Auth);
        const auth = await authRepository.findOne({ where: { id } });
        await this.disconnect();
        if (!auth) return null;
        return auth;
    }
    async findByUsername(username: string): Promise<Auth | null> {
        const dataSource = await this.connect();
        const authRepository: Repository<Auth> = dataSource.getRepository(Auth);
        const auth = await authRepository.findOne({ where: { username } });
        await this.disconnect();
        if (!auth) return null;
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
