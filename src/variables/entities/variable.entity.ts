
import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Variable {
    @PrimaryGeneratedColumn('uuid')
    variableId:string;
    
    @Column('text')
    variableDescription:string;
    
    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    variableAmount:number;
}
