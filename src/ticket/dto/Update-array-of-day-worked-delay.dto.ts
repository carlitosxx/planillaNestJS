import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateArrayOfDayWorkedDelay{
    @IsArray()
    ticketData:TicketData[]
}

class TicketData{
    @IsString()    
    ticketTempCorrelative:string;
    
    @IsNumber()
    ticketTempDaysWorked:number;

    @IsNumber()
    ticketTempDaysNotWorked:number;

    @IsNumber()
    ticketTempDaysSubsidized:number;

    @IsOptional()
    @IsDateString()
    ticketTempDateStartVacation?:Date;

    @IsOptional()
    @IsDateString()
    ticketTempDateEndVacation?:Date;

    @IsNumber()
    delayDays:number;

    @IsNumber()
    delayHours:number;
    
    @IsNumber()
    delayMinutes:number;
}