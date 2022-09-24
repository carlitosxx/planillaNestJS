import { IsString, MaxLength } from "class-validator";

export class CreateTypeConceptDto{  
    @IsString()
    @MaxLength(100)
    typeConceptDescription:   string;
}