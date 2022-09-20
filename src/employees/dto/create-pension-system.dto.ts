import { IsString, MaxLength } from "class-validator";

export class CreatePensionSystemDto{
    @IsString()
    @MaxLength(6)
    pensionSystemCode:           string;

    @IsString()
    @MaxLength(100)
    pensionSystemDescription:    string;
}