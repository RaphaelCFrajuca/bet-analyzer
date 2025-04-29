import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Database } from "src/database/providers/interfaces/database.interface";

@Injectable()
export class AuthService {
    constructor(
        @Inject("DATABASE_PROVIDER") private readonly databaseProvider: Database,
        @Inject("JWT_TOKEN_SECRET") private readonly jwtTokenSecret: string,
        private readonly jwtService: JwtService,
    ) {}

    async login(username: string, password: string): Promise<AuthResponse> {
        const user = await this.databaseProvider.findByUsername(username);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.password !== password) {
            throw new UnauthorizedException("Invalid password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        const jwtToken = await this.jwtService.signAsync(
            {
                id: user.id,
                username: user.username,
            },
            {
                secret: this.jwtTokenSecret,
            },
        );
        return {
            token: jwtToken,
        };
    }

    async register(username: string, password: string): Promise<void> {
        const existingUser = await this.databaseProvider.findByUsername(username);
        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.databaseProvider.createUser(username, hashedPassword);
    }
}

export interface AuthResponse {
    token: string;
}
