import { Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    login() {
        return "Login endpoint";
    }

    @Post("register")
    register() {
        return "Register endpoint";
    }
}
