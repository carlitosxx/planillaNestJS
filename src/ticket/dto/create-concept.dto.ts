import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator";
import { TypeConcept } from "../entities";

export class CreateConceptDto{  
   
    @IsString()
    @MaxLength(6)
    conceptCodeSiaf:string;

    @IsString()
    @MaxLength(6)
    conceptCodePlame:string;

    @IsString()
    @MaxLength(100)
    conceptGlosa:string;

    @IsString()
    @MaxLength(100)
    conceptDescription:string;

    @IsBoolean()
    conceptIsDiscounted:boolean;
    
    @IsNumber()
    conceptCode:number

    @IsBoolean()
    conceptIsCalculated:boolean;

    @IsString()
    typeConcept:TypeConcept;
}