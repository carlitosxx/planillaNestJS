import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { TicketTemp } from "./ticketTemp.entity";

@Entity()
@Index(['ticketTemp', 'conceptId'], { unique: true })
export class TicketDetailTemp {  
    // @Column('text')
    @PrimaryColumn()
    ticketTempCorrelative:string
    
    @ManyToOne(()=>TicketTemp,ticketTemp=>ticketTemp.ticketTempCorrelative)
    @JoinColumn({name:'ticketTempCorrelative'})
    ticketTemp:TicketTemp
       
    @Column('text')
    @PrimaryColumn()
    conceptId:string

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })    
    ticketDetailTempAmount:number;  
}