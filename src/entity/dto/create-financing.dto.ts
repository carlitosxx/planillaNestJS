import {  IsString, MaxLength } from "class-validator";

export class CreateFinancingDto {   
    @IsString()
    @MaxLength(100)
    financingDescription:         string;
}
