import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class TypeEmployee{
    @PrimaryGeneratedColumn('uuid')    
    typeEmployeeId:             string;
    
    @Column("text")
    typeEmployeeDescription:    string;
}