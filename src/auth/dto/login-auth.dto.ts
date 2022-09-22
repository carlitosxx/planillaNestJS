import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsString()
    @IsEmail()
    authEmail:  string;

    @IsString()
    @MaxLength(12)
    @MinLength(6)
    authPassword:    string;
}
