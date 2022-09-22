import { IsNumber, IsString, MaxLength } from "class-validator";
import { PensionSystem } from "../entities";

export class CreatePensionAdministratorDto{
    @IsString()    
    pensionAdministratorCode:          string;

    @IsString()    
    pensionAdministratorDescription:          string;

    @IsString()    
    pensionSystem:   PensionSystem;
}