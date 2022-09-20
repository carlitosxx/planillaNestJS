import { IsDate, IsDateString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateOrganicUnitDto{
    @IsString()
    @MaxLength(6)
    organicUnitCode:           string;

    @IsString()
    @MaxLength(100)
    organicUnitDescription:    string;
}