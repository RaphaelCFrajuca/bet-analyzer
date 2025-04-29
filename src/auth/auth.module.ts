import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "src/database/database.module";
import { EnvironmentModule } from "src/environment/environment.module";
import { AuthController } from "./controllers/auth.controller";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/auth.service";

@Module({
    imports: [
        EnvironmentModule,
        DatabaseModule,
        JwtModule.register({
            signOptions: {
                expiresIn: "1d",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthGuard, AuthService],
    exports: [AuthGuard],
})
export class AuthModule {}
