import {  IsString, MaxLength } from "class-validator";

export class CreateBudgetGoalDto {   
    @IsString()
    @MaxLength(100)
    budgetGoalDescription:         string;
}
