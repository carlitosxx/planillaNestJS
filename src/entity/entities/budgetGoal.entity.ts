import {Column, Entity,  PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class BudgetGoal {
    @PrimaryGeneratedColumn('uuid')    
    budgetGoalId:            string;

    @Column("text")
    budgetGoalDescription:   string;   
}
