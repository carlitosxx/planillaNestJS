
import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
@Entity()
// @Index(['variableId','variableDescription'],{unique:true})
export class Variable {
    @PrimaryGeneratedColumn('uuid')
    variableId:string;
    
    @Column('text')
    @Index({ unique: true })
    variableDescription:string;
    
    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    variableAmount:number;
}
