import { DataSource, DeepPartial, Repository } from "typeorm";
import { Database } from "../interfaces/database.interface";
import { Auth } from "./entities/auth.entity";
import { MatchEntity } from "./entities/match/match.entity";
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
            logging: true,
        });
    }

    async createMatch(matchInput: DeepPartial<MatchEntity>): Promise<MatchEntity> {
        const dataSource = await this.connect();
        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const matchRepo = queryRunner.manager.getRepository(MatchEntity);

            // ⚠️  IMPORTANTE:
            // - Para INSERT: deixe sub-entidades sem `id`.
            // - Para UPDATE: inclua o `id` e só os campos que quer alterar.
            // O TypeORM decide se insere ou atualiza cada node da árvore.

            const savedMatch = await matchRepo.save(matchInput, { reload: true });

            await queryRunner.commitTransaction();
            return savedMatch;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao salvar match:", err);
            throw err;
        } finally {
            await queryRunner.release();
            await this.disconnect();
        }
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
        if (!this.dataSource.isInitialized) {
            return await this.dataSource.initialize();
        } else {
            return this.dataSource;
        }
    }
    async disconnect(): Promise<void> {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }
}
