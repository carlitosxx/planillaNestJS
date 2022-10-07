import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { PensionSystem } from './pensionSystem.entity';

@Entity()
export class PensionAdministrator{
    @PrimaryGeneratedColumn('uuid')    
    pensionAdministratorId:string;
    
    @Index({ unique: true })
    @Column("text")
    pensionAdministratorCode:string;

    @Column("text")
    pensionAdministratorDescription:string;  

    @Column({type:"numeric",nullable:true})
    pensionAdministratorComVar:number

    @Column({type:"numeric",nullable:true})
    pensionAdministratorContriManda:number

    @Column({type:"numeric",nullable:true})
    pensionAdministratorInsurance:number

    @Column({type:"numeric",nullable:true})
    pensionAdministratorAnnualOnBalance:number
    
    @Column({type:"numeric",nullable:true})
    pensionAdministratorDiscount?:number

    @ManyToOne(()=>PensionSystem,
    pensionSystem=>pensionSystem.pensionSystemId,
    {onDelete:'CASCADE'})
    @JoinColumn({name:'pensionSystemId'})
    pensionSystem: PensionSystem
}