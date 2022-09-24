import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Financing } from "../entities";

export class CreateEntityDto {
    @IsString()
    @MaxLength(11)
    @MinLength(11)
    entityRuc:          string;

    @IsString()
    entityName:         string;

    @IsString()
    @MaxLength(6)
    @MinLength(6)
    entityCode:         string;

    @IsString()
    @MaxLength(100)
    entityEmployer:     string;

    @IsNumber()
    entityStatus:       number;

    @IsOptional()
    @IsString()
    entityLogo?:       string;

    @IsString()
    financing:Financing;

}
