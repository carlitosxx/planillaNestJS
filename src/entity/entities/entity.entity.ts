import { ColumnNumericTransformer } from 'src/helper/column-numeric-Transformer';
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { BudgetGoal } from './budgetGoal.entity';
import { Financing } from './financing.entity';
@Entity()
export class Entitie {
    @PrimaryGeneratedColumn('uuid')    
    entityId:            string;
    
    @Index({ unique: true })
    @Column("text")
    entityRuc:          string;

    @Column("text")
    entityName:          string;

    @Index({ unique: true })
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

    @ManyToOne(
      ()=>Financing,
      financing=>financing.financingId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'financingId'})
    financing:Financing;

    @ManyToOne(
      ()=>BudgetGoal,
      budgetGoal=>budgetGoal.budgetGoalId,
      {onDelete:'CASCADE'})
    @JoinColumn({name:'budgetGoalId'})
    budgetGoal:BudgetGoal;
}
