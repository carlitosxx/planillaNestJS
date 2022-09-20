import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Condition } from "./condition.entity";
import { OrganicUnit } from "./organicUnit.entity";
import { Salary } from "./salary.entity";
import { TypeEmployee } from "./typeEmployee.entity";
/**TABLA EMPLEADO */
@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @Column("text",{unique:true})
    employeeDni: string;

    @Column("text")
    employeeFullname: string;

    @Column("numeric")
    employeeStatus: number;

    @Column({type:"date",nullable:false})
    employeeEntryDate: Date;

    @Column("text")
    employeeCUSPP: string;

    @Column("text")
    employeeAIRHSP: string;

    @ManyToOne(()=>TypeEmployee,typeEmployee=>typeEmployee.typeEmployeeId)
    @JoinColumn({name:'typeEmployeeId',referencedColumnName:'typeEmployeeId'})
    typeEmployee: TypeEmployee

    @ManyToOne(()=>OrganicUnit,organicUnit=>organicUnit.organicUnitId)
    @JoinColumn({name:'organicUnitId'})
    organicUnit: OrganicUnit

    @ManyToOne(()=>Condition,condition=>condition.conditionId)
    @JoinColumn({name:'conditionId'})
    condition: Condition

    @ManyToOne(()=>Salary,salary=>salary.salaryId)
    @JoinColumn({name:'salaryId'})
    salary:Salary

}
