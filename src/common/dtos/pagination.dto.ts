import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsUUID, Min } from "class-validator";
import { min } from "rxjs";

export class PaginationDto{
    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    size?: number;
    @IsOptional()
    @IsPositive()
    @Min(0)
    @Type(()=>Number)
    page?: number;

    @IsOptional()
    @IsUUID()
    employeeCategoryId?:string;

    @IsOptional()
    @IsUUID()
    pensionSystemId?:string;
}