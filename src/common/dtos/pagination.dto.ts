import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, IsUUID, Min } from "class-validator";


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
    @IsString()
    employeeDni?:string

    @IsOptional()
    @IsString()
    employeeFullname?:string

    @IsOptional()
    @IsUUID()
    pensionSystemId?:string;
    
    @IsOptional()
    @Type(()=>Number)
    withStatus?:number
}