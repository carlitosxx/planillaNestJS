import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { EmployeeCategory } from './employeCategory.entity';


@Entity()
@Index(['salarySalary', 'salaryYear'], { unique: true })
export class Salary{
    @PrimaryGeneratedColumn('uuid')    
    salaryId:            string;
    
    @Column('numeric', {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    salarySalary:          number;

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    salaryYear:            number;  

    @ManyToOne(()=>EmployeeCategory,employeeCategory=>employeeCategory.employeeCategoryId)
    @JoinColumn({name:'employeeCategoryId'})
    employeeCategory: EmployeeCategory
}

