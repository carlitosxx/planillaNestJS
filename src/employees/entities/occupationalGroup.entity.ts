import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class OccupationalGroup{
    @PrimaryGeneratedColumn('uuid')    
    occupationalGroupId:                 string;
    
    @Index({ unique: true })
    @Column("text")    
    occupationalGroupCode:               string;

    @Column("text")
    occupationalGroupName:               string;

    @Column("text")
    occupationalGroupDescription:        string;
}