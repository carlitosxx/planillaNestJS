import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCorrelativeDto{ 
    @IsString()
    @MaxLength(6)
    correlativeSerie:string;
    @IsNumber()
    correlativeYear:number;
    @IsNumber()
    correlativeNumber:number;
 }