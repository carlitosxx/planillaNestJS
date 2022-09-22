import {Column, Entity,  PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class Financing {
    @PrimaryGeneratedColumn('uuid')    
    financingId:            string;

    @Column("text")
    financingDescription:   string;
   
}
