import { IsString, MaxLength } from "class-validator";

export class CreateEstablishmentDto{
    @IsString()
    @MaxLength(6)
    establishmentCode:          string;

    @IsString()
    @MaxLength(100)
    establishmentName:          string;

    @IsString()
    @MaxLength(100)
    establishmentDescription:   string;
}