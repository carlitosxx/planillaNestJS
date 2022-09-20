import { IsNumber, IsString, MaxLength } from "class-validator";
import { EmployeeCategory } from "../entities";

export class CreateSalaryDto{
    @IsNumber()    
    salarySalary:          number;

    @IsNumber()    
    salaryYear:          number;

    @IsString()    
    employeeCategory:   EmployeeCategory;
}