import { IsString, MaxLength } from "class-validator";

export class CreateOccupationalGroupDto{
    @IsString()
    @MaxLength(6)
    occupationalGroupCode:          string;

    @IsString()
    @MaxLength(100)
    occupationalGroupName:          string;

    @IsString()
    @MaxLength(100)
    occupationalGroupDescription:   string;
}