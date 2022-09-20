import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { PensionSystem } from './pensionSystem.entity';

@Entity()
export class PensionAdministrator{
    @PrimaryGeneratedColumn('uuid')    
    pensionAdministratorId:            string;
    
    @Index({ unique: true })
    @Column("text")
    pensionAdministratorCode:          string;

    @Column("text")
    pensionAdministratorDescription:            string;  

    @ManyToOne(()=>PensionSystem,pensionSystem=>pensionSystem.pensionSystemId)
    @JoinColumn({name:'pensionSystemId'})
    pensionSystem: PensionSystem
}