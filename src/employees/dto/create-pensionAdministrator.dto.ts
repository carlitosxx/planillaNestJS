import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { PensionSystem } from "../entities";

export class CreatePensionAdministratorDto{
    @IsString()    
    pensionAdministratorCode:string;

    @IsString()    
    pensionAdministratorDescription:string;

    @IsOptional()
    @IsNumber()
    pensionAdministratorComVar?:number;

    @IsOptional()
    @IsNumber()
    pensionAdministratorContriManda?:number;

    @IsOptional()
    @IsNumber()
    pensionAdministratorInsurance?:number;

    @IsOptional()
    @IsNumber()
    pensionAdministratorAnnualOnBalance?:number

    @IsOptional()
    @IsNumber()
    pensionAdministratorDiscount?:number

    @IsString()    
    pensionSystem:   PensionSystem;
}