import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class PensionSystem{
    @PrimaryGeneratedColumn('uuid')    
    pensionSystemId:             string;
    
    @Index({ unique: true })
    @Column("text")    
    pensionSystemCode:           string;

    @Column("text")
    pensionSystemDescription:    string;
}