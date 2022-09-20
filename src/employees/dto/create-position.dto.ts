import { IsString, MaxLength } from "class-validator";

export class CreatePositionDto{
    @IsString()
    @MaxLength(6)
    positionCode:          string;

    @IsString()
    @MaxLength(100)
    positionName:          string;

    @IsString()
    @MaxLength(100)
    positionDescription:   string;
}