import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    ticketId:   string;

    @Column('text')
    ticketEntityId: string;

    @Column("text")
    ticketEntityLogo: string;

    @Column('text')
    ticketEntityName:   string;
    
    @Column('text')
    ticketEntityCode:   string;

    @Column('text')
    ticketEntityEmployer: string; 

    @Column('text')
    ticketEntityRuc:  string;

    @Column('text')
    ticketFinancingId:string;

    @Column('text')
    ticketFinancingDescription: string;

    @Column('text')
    ticketbudgetGoalId:   string;

    @Column('text')
    ticketbudgetGoalDescription:   string;

    @Column('text')
    ticketEmployeeId:   string;

    @Column('text')
    ticketEmployeeDni:  string;

    @Column('text')
    ticketEmployeeFullname: string;

    @Column('date')
    ticketEmployeeEntryDate: Date;

    @Column("text")
    ticketEmployeeCUSPP: string;

    @Column("text")
    ticketEmployeeAIRHSP: string;

    @Column('text')
    ticketTypeEmployeeId: string;
    
    @Column('text')
    ticketTypeEmployeeDescription: string;

    @Column('text',{unique:true})
    ticketCorrelative:  string // B2020-00001
    


    @Column({
        type: 'timestamptz',
        default: () =>
        'NOW()',   })  
    ticketCreatedAt: Date;

    @Column('numeric', {
        precision: 2,
        scale: 0,
        transformer: new ColumnNumericTransformer(),
    })
    ticketStatus:   number;
}
