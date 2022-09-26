import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString } from "class-validator";

export class CorrelativeParamDto{     
    @IsPositive()
    @Type(()=>Number)
    correlativeYear:number;

    @IsString()   
    correlativeSerie:string;
}