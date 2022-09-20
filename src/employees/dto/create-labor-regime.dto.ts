import { IsString, MaxLength } from "class-validator";

export class CreateLaborRegimeDto{
    @IsString()
    @MaxLength(6)
    laborRegimeCode:          string;

    @IsString()
    @MaxLength(100)
    laborRegimeName:          string;

    @IsString()
    @MaxLength(100)
    laborRegimeDescription:   string;
}