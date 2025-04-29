import { Database } from "../interfaces/database.interface";
import { PostgresqlConfig } from "./interfaces/postgresql-config.interface";

export class PostgresqlProvider implements Database {
    constructor(private readonly postgresqlConfig: PostgresqlConfig) {}

    async connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
