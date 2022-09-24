import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsString,IsBoolean, IsArray } from "class-validator";
import { LoginAuthDto } from "./login-auth.dto";

export class RegisterAuthDto extends PartialType(LoginAuthDto){
    
    @IsString()
    authFullname:   string ;
    @IsString()
    authPassword:string;
    @IsArray()
    authRole:   string[];
}
