import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class OrganicUnit{
    @PrimaryGeneratedColumn('uuid')    
    organicUnitId:             string;
    
    @Index({ unique: true })
    @Column("text")    
    organicUnitCode:           string;

    @Column("text")
    organicUnitDescription:    string;
}