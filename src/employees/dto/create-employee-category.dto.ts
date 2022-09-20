import { IsString, MaxLength } from "class-validator";

export class CreateEmployeeCategoryDto{   

    @IsString()
    @MaxLength(10)
    employeeCategoryShortDescription:          string;

    @IsString()
    @MaxLength(100)
    employeeCategoryDescription:               string;
}