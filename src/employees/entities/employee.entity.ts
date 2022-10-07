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

    @Column("numeric",{
      default:1})    
    employeeStatus: number;

    @Column({type:"date",nullable:false})
    employeeEntryDate: Date;

    @Column("text")
    employeeCUSPP: string;

    @Column({type:"bool",nullable:true})
    employeeTypeCommission: boolean;

    @Column("text")
    employeeAIRHSP: string;

    @ManyToOne(
      ()=>TypeEmployee,
      typeEmployee=>typeEmployee.typeEmployeeId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'typeEmployeeId',referencedColumnName:'typeEmployeeId'})
    typeEmployee: TypeEmployee;

    @ManyToOne(
      ()=>OrganicUnit,
      organicUnit=>organicUnit.organicUnitId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'organicUnitId'})
    organicUnit: OrganicUnit;

    @ManyToOne(
      ()=>Condition,
      condition=>condition.conditionId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'conditionId'})
    condition: Condition;

    @ManyToOne(
      ()=>LaborRegime,
      laborRegime=>laborRegime.laborRegimeId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'laborRegimeId'})
    laborRegime: LaborRegime;

    @ManyToOne(
      ()=>OccupationalGroup,
      occupationalGroup=>occupationalGroup.occupationalGroupId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'occupationalGroupId'})
    occupationalGroup: OccupationalGroup;

    @ManyToOne(
      ()=>Establishment,
      establishment=>establishment.establishmentId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'establishmentId'})
    establishment: Establishment;

    @ManyToOne(
      ()=>Position,
      position=>position.positionId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'positionId'})
    position: Position;

    @ManyToOne(
      ()=>Workday,
      workday=>workday.workdayId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'workdayId'})
    workday: Workday;

    @ManyToOne(
      ()=>Salary,
      salary=>salary.salaryId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'salaryId'})
    salary:Salary;

    @ManyToOne(
      ()=>PensionAdministrator,
      pensionAdministrator=>pensionAdministrator.pensionAdministratorId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'pensionAdministratorId'})
    pensionAdministrator:PensionAdministrator;
}
