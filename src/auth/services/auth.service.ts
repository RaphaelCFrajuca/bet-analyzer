import { Inject, Injectable } from "@nestjs/common";
import { Database } from "src/database/providers/interfaces/database.interface";

@Injectable()
export class AuthService {
    constructor(@Inject("DATABASE_PROVIDER") private readonly databaseProvider: Database) {}
}
