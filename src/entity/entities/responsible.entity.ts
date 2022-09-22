import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import {Column, Entity,  Index,  PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class Responsible {
    @PrimaryGeneratedColumn('uuid')    
    responsibleId:            string;
    
    @Index({ unique: true })
    @Column("text")
    responsibleDni:           string;

    @Column("text")
    responsibleFullname:      string;

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })   
    responsibleStatus:      number;

    @Column("text")
    responsibleSignature:      string;
   
}
