import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Condition } from "./condition.entity";
import { Establishment } from "./establishment.entity";
import { LaborRegime } from "./laborRegime.entity";
import { OccupationalGroup } from "./occupationalGroup.entity";
import { OrganicUnit } from "./organicUnit.entity";
import { PensionAdministrator } from "./pensionAdministrator.entity";
import { Position } from "./position.entity";
import { Salary } from "./salary.entity";
import { TypeEmployee } from "./typeEmployee.entity";
import { Workday } from "./workday.entity";
/**TABLA EMPLEADO */
@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;
    @Column("text",{unique:true})
    employeeDni: string;
    @Column("text")
    employeeFullname: string;
    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })    
    employeeStatus: number;
    @Column({type:"date",nullable:false})
    employeeEntryDate: Date;
    @Column("text")
    employeeCUSPP: string;
    @Column("text")
    employeeAIRHSP: string;
    @ManyToOne(()=>TypeEmployee,typeEmployee=>typeEmployee.typeEmployeeId)
    @JoinColumn({name:'typeEmployeeId',referencedColumnName:'typeEmployeeId'})
    typeEmployee: TypeEmployee;
    @ManyToOne(()=>OrganicUnit,organicUnit=>organicUnit.organicUnitId)
    @JoinColumn({name:'organicUnitId'})
    organicUnit: OrganicUnit;
    @ManyToOne(()=>Condition,condition=>condition.conditionId)
    @JoinColumn({name:'conditionId'})
    condition: Condition;
    @ManyToOne(()=>LaborRegime,laborRegime=>laborRegime.laborRegimeId)
    @JoinColumn({name:'laborRegimeId'})
    laborRegime: LaborRegime;
    @ManyToOne(()=>OccupationalGroup,occupationalGroup=>occupationalGroup.occupationalGroupId)
    @JoinColumn({name:'occupationalGroupId'})
    occupationalGroup: OccupationalGroup;
    @ManyToOne(()=>Establishment,establishment=>establishment.establishmentId)
    @JoinColumn({name:'establishmentId'})
    establishment: Establishment;
    @ManyToOne(()=>Position,position=>position.positionId)
    @JoinColumn({name:'positionId'})
    position: Position;
    @ManyToOne(()=>Workday,workday=>workday.workdayId)
    @JoinColumn({name:'workdayId'})
    workday: Workday;
    @ManyToOne(()=>Salary,salary=>salary.salaryId)
    @JoinColumn({name:'salaryId'})
    salary:Salary;
    @ManyToOne(()=>PensionAdministrator,pensionAdministrator=>pensionAdministrator.pensionAdministratorId)
    @JoinColumn({name:'pensionAdministratorId'})
    pensionAdministrator:PensionAdministrator;
}
