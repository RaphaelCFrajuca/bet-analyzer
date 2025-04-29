import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}
