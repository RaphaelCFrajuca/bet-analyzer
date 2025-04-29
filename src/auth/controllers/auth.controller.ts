import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";
import { AuthResponse, AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @Post("register")
    register(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto.username, registerDto.password);
    }
}
