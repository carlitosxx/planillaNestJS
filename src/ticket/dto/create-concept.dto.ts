import { IsBoolean, IsString, MaxLength } from "class-validator";
import { TypeConcept } from "../entities";

export class CreateConceptDto{  
    @IsString()
    @MaxLength(6)
    conceptCode:string;
    @IsString()
    @MaxLength(100)
    conceptDescription:string;
    @IsBoolean()
    conceptIsCalculated:boolean;
    @IsString()
    typeConcept:TypeConcept;
}