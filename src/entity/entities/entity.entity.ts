import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class Entitie {
    @PrimaryGeneratedColumn('uuid')    
    entityId:            string;
    
    @Index({ unique: true })
    @Column("text")
    entityRuc:          string;

    @Column("text")
    entityName:          string;

    @Column("text")
    entityCode:           string;

    @Column("text")
    entityEmployer:       string;

    @Column("text")
    entityLogo:           string;

    @Column("numeric", {
        precision: 7,
        scale: 0,
        transformer: new ColumnNumericTransformer(),
      })  
    entityStatus:          number;
}
