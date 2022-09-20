import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class EmployeeCategory{
    @PrimaryGeneratedColumn('uuid')    
    employeeCategoryId:                 string;  
    
    @Index({ unique: true })
    @Column("text")
    employeeCategoryShortDescription:   string;

    @Column("text")
    employeeCategoryDescription:        string;
}