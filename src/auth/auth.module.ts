import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentModule } from "src/environment/environment.module";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    imports: [
        EnvironmentModule,
        JwtModule.register({
            signOptions: {
                expiresIn: "1d",
            },
        }),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class AuthModule {}
