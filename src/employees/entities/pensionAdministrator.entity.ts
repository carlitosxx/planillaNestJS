import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import { TransformStringToInteger } from 'src/helper/transform-string-to-integer';
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { PensionSystem } from './pensionSystem.entity';

@Entity()
export class PensionAdministrator{
    @PrimaryGeneratedColumn('uuid')    
    pensionAdministratorId:string;
    
    @Index({ unique: true })
    @Column("text")
    pensionAdministratorCode:string;

    @Column("text")
    pensionAdministratorDescription:string;  

    @Column("numeric", {nullable:true,
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    pensionAdministratorComVar:number

    @Column("numeric", {nullable:true,
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    pensionAdministratorContriManda:number

    @Column("numeric", {nullable:true,
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    pensionAdministratorInsurance:number

    @Column("numeric", {nullable:true,
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    pensionAdministratorAnnualOnBalance:number
    
    @Column("numeric", {nullable:true,
        precision: 7,
        scale: 2,
        transformer: new ColumnNumericTransformer(),
      })
    pensionAdministratorDiscount?:number

    @ManyToOne(()=>PensionSystem,
    pensionSystem=>pensionSystem.pensionSystemId,
    {onDelete:'CASCADE'})
    @JoinColumn({name:'pensionSystemId'})
    pensionSystem: PensionSystem
}