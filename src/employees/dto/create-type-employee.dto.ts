import { IsDate, IsDateString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTypeEmployeeDto{
    @IsString()
    typeEmployeeDescription:    string;
}