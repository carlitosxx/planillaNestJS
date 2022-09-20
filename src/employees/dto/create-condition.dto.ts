import { IsString, MaxLength } from "class-validator";

export class CreateConditionDto{
    @IsString()
    @MaxLength(6)
    conditionCode:          string;

    @IsString()
    @MaxLength(100)
    conditionName:          string;

    @IsString()
    @MaxLength(100)
    conditionDescription:   string;
}