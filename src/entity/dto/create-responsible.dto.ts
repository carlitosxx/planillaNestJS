import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateResponsibleDto{
    @IsString()
    @MaxLength(8)
    responsibleDni:         string;

    @IsString()
    @MaxLength(100)
    responsibleFullName:    string;

    @IsNumber()
    responsibleStatus:      number;

    @IsString()
    responsibleSignature:   string;
}