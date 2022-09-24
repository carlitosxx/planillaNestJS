import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Employee } from "src/employees/entities";
import { Entitie, Responsible } from "src/entity/entities";

export class CreateTicketTempDto{  
    @IsString()    
    ticketTempCorrelative:string;
    @IsString()
    entity:Entitie;
    @IsString()
    employee:Employee;    
    @IsString()
    responsible:Responsible;   
    @IsNumber()
    ticketTempStatus:number;
    @IsString()
    ticketTempObservacion:string;
    @IsNumber()
    ticketTempNetAmount:number;
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
  
}