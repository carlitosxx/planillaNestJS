import { Employee } from "src/employees/entities";
import { Entitie, Responsible } from "src/entity/entities";
import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TicketTemp {
    @PrimaryGeneratedColumn('uuid')
    ticketTempId:string;

    @Column('text',{unique:true})
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

    @Column('numeric', {
        precision: 10,
        scale: 0,
        transformer: new ColumnNumericTransformer(),
    })
    ticketTempStatus:   number;

    @Column('text')
    ticketTempObservacion:string;

    @Column('numeric', {
        precision: 10,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
    })
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