import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject("JWT_TOKEN_SECRET") private readonly jwtTokenSecret: string,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new BadRequestException("Token not found");

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.jwtTokenSecret,
            });
            request["user"] = payload;
        } catch {
            throw new UnauthorizedException("Invalid token");
        }
        console.log("User authenticated", request["user"]);
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
