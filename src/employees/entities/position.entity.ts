import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Position{
    @PrimaryGeneratedColumn('uuid')    
    positionId:                 string;
    
    @Index({ unique: true })
    @Column("text")    
    positionCode:               string;

    @Column("text")
    positionName:               string;

    @Column("text")
    positionDescription:        string;
}