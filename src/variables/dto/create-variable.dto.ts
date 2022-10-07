import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateVariableDto {
    @IsString()
    variableDescription:string;
    @IsNumber()
    variableAmount:number
}
