import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['ticketDetailTempCorrelative', 'conceptId'], { unique: true })
export class TicketDetailTemp { 
    @PrimaryGeneratedColumn('uuid')    
    ticketDetailTemp:            string;
    // @PrimaryColumn()
    @Column('text')
    ticketDetailTempCorrelative:string
       
    @Column('text')
    conceptId:string
    // @Column('text')
    // ticket:string

    // @Column("numeric", {
    //     precision: 7,
    //     scale: 2,
    //     transformer: new ColumnNumericTransformer(),
    //   })    
    // ticketDetailTempAmount:number;  
}