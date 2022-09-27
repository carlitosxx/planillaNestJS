import { IsNumber, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateTicketDetailTempDto{
    @IsString()
    @MaxLength(11) //B2022-00001
    @MinLength(11)
    ticketTempCorrelative:string;

    @IsString()
    @IsUUID()
    conceptId:string;

    @IsNumber()
    ticketDetailTempAmount:number;
}