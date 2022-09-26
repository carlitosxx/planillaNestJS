import { IsNumber, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateTicketDetailTempDto{
    @IsString()
    @MaxLength(12) //B2022-000001
    @MinLength(12)
    ticketTempCorrelative:string;

    @IsString()
    @IsUUID()
    conceptId:string;

    @IsNumber()
    ticketDetailTempAmount:number;
}