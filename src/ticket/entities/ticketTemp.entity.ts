import { Employee } from "src/employees/entities";
import { Entitie, Responsible } from "src/entity/entities";
import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['ticketTempCorrelative'],{unique:true})
export class TicketTemp {
    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })
    ticketTempYear:number

    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })
    ticketTempMonth:number
 
    @PrimaryColumn('text')    
    ticketTempCorrelative:  string 

    @ManyToOne(()=>Entitie,entitie=>entitie.entityId)
    @JoinColumn({name:'entitieId'})
    entity:Entitie; 

    @ManyToOne(()=>Employee,employee=>employee.employeeId)
    @JoinColumn({name:'employeeId'})
    employee:Employee; 

    @ManyToOne(()=>Responsible,responsible=>responsible.responsibleId)
    @JoinColumn({name:'responsibleId'})
    responsible:Responsible;

    @Column({
        type:'timestamptz',
        default: () =>'NOW()'})  
    ticketTempCreatedAt: Date;

    @Column('numeric',{
        transformer: new TransformStringToInteger(),
        default:1})
    ticketTempStatus:   number;

    @Column('text')
    ticketTempObservacion:string;

    @Column('numeric',{
        transformer: new TransformStringToInteger(),
        default:0})
    ticketTempNetAmount:number;
   
    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })
    ticketTempDaysWorked:number;
    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })
    ticketTempDaysNotWorked:number;

    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })    
    ticketTempDaysSubsidized:number;

    @Column('date',{nullable:true})
    ticketTempDateStartVacation:Date;
    
    @Column('date',{nullable:true})
    ticketTempDateEndVacation:Date;
}