import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Concept } from "./concept.entity";
import { TicketTemp } from "./ticketTemp.entity";

@Entity()
@Index(['ticketTemp', 'conceptId'], { unique: true })
export class TicketDetailTemp {      
    @PrimaryColumn()
    ticketTempCorrelative:string
    
    @ManyToOne(()=>TicketTemp,ticketTemp=>ticketTemp.ticketTempCorrelative)
    @JoinColumn({name:'ticketTempCorrelative'})
    ticketTemp:TicketTemp
      
    @PrimaryColumn()
    conceptId:string
    
    @ManyToOne(()=>Concept,concept=>concept.conceptId)
    @JoinColumn({name:'conceptId'})
    concept:Concept

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })    
    ticketDetailTempAmount:number;  
}