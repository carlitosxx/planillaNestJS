import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Workday{
    @PrimaryGeneratedColumn('uuid')    
    workdayId:                  string;
    
    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })    
    workdayHoursDay:            number;

    @Column("numeric", {
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })   
    workdayDaysWeek:            number;

    @Column("text")
    workdayDescription:         string;
}