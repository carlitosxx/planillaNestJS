import { IsArray, IsNumber, IsString } from "class-validator";
import { Employee } from "src/employees/entities";
import { Entitie, Responsible } from "src/entity/entities";

export class CreateBatchTicketTemp{
    @IsNumber()   
    ticketTempMonth:number;

    @IsNumber()   
    ticketTempYear:number;
    
    @IsString()
    entity:Entitie;

    @IsArray()
    employees:string[];  

    @IsString()
    responsible:Responsible; 

    // @IsArray()
    // concepts:[];
}