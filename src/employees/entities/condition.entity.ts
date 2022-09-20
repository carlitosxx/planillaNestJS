import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Condition{
    @PrimaryGeneratedColumn('uuid')    
    conditionId:            string;
    
    @Index({ unique: true })
    @Column("text")
    conditionCode:          string;

    @Column("text")
    conditionName:          string;

    @Column("text")
    conditionDescription:   string;
}