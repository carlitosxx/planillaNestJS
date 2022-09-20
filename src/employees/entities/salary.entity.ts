import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { EmployeeCategory } from './employeCategory.entity';

@Entity()
@Index(['salarySalary', 'salaryYear'], { unique: true })
export class Salary{
    @PrimaryGeneratedColumn('uuid')    
    salaryId:            string;
    
    // @Index({ unique: true })
    @Column("numeric")
    salarySalary:          number;

    @Column("numeric")
    salaryYear:            number;  

    @ManyToOne(()=>EmployeeCategory,employeeCategory=>employeeCategory.employeeCategoryId)
    @JoinColumn({name:'employeeCategoryId'})
    employeeCategory: EmployeeCategory
}