import { IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateWorkdayDto{
    @IsNumber()
    @IsPositive()    
    workdayHoursDay:          number;

    @IsNumber()
    @IsPositive()       
    workdayDaysWeek:          number;

    @IsString()
    @MaxLength(100)
    workdayDescription:   string;
}