import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Establishment{
    @PrimaryGeneratedColumn('uuid')    
    establishmentId:                 string;
    
    @Index({ unique: true })
    @Column("text")    
    establishmentCode:               string;

    @Column("text")
    establishmentName:               string;

    @Column("text")
    establishmentDescription:        string;
}