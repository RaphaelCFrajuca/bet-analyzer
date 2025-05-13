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
            extra: {
                max: 150,
            },
        });
    }
    async getMatchById(id: number): Promise<MatchEntity | null> {
        const dataSource = await this.connect();
        const matchRepo = dataSource.getRepository(MatchEntity);
        const match = await matchRepo.findOne({ where: { id } });
        await this.disconnect();
        if (!match) return null;
        return match;
    }

    async createMatch(matchInput: DeepPartial<MatchEntity>): Promise<MatchEntity> {
        const dataSource = await this.connect();
        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            const matchRepo = queryRunner.manager.getRepository(MatchEntity);

            if (!matchInput.referee?.id) {
                matchInput.referee = undefined;
            }

            const stats = matchInput.matchStatistics;
            if (stats) {
                if (stats.general) {
                    stats.general.matchStats = stats;
                }

                if (stats.detailed) {
                    stats.detailed.matchStats = stats;
                }
            }

            // ✅ Associar os forms corretamente e garantir que a team tem a lista completa
            if (matchInput.homeTeam?.recentForm?.length) {
                for (const form of matchInput.homeTeam.recentForm) {
                    form.team = matchInput.homeTeam;
                }

                // Garante que é entidade, não só objeto solto
                matchInput.homeTeam = {
                    ...matchInput.homeTeam,
                    recentForm: matchInput.homeTeam.recentForm,
                };
            }

            if (matchInput.awayTeam?.recentForm?.length) {
                for (const form of matchInput.awayTeam.recentForm) {
                    form.team = matchInput.awayTeam;
                }

                matchInput.awayTeam = {
                    ...matchInput.awayTeam,
                    recentForm: matchInput.awayTeam.recentForm,
                };
            }

            // 🚨 Aqui é onde o TypeORM vai aplicar o cascade se estiver tudo certo nas entidades
            const savedMatch = await matchRepo.save(matchInput, { reload: true });

            await queryRunner.commitTransaction();
            return savedMatch;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error("Erro ao salvar match:", err);
            throw err;
        } finally {
            await queryRunner.release();
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
