import { DataSource } from "typeorm";
import { Auth } from "../postgresql/entities/auth.entity";

export interface Database {
    connect(): Promise<DataSource>;
    disconnect(): Promise<void>;
    findById(id: string): Promise<Auth | null>;
    findByUsername(username: string): Promise<Auth | null>;
    createUser(username: string, password: string): Promise<void>;
}
