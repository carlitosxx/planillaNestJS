import { ColumnNumericTransformer } from "src/helper/column-numeric-Transformer";
import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeConcept } from "./typeConcept.entity";
@Entity()
export class Concept {
    @PrimaryGeneratedColumn('uuid')
    conceptId:string;

    @Index({ unique: true })
    @Column('text')
    conceptCodeSiaf:string;

    @Index({ unique: true })
    @Column('text')
    conceptCodePlame:string;

    @Column('text')
    conceptGlosa:string;

    @Column('text')
    conceptDescription:string;

    @Column('bool')
    conceptIsDiscounted:boolean;

    @Column('bool')
    conceptIsCalculated:boolean;

    @Column({ type: 'numeric', nullable: true})
    conceptCode:number
    
    @ManyToOne(
        ()=>TypeConcept,
        typeConcept=>typeConcept.typeConceptId,
        {onDelete:'CASCADE'})
    @JoinColumn({name:'typeConceptId'})
    typeConcept:TypeConcept;
}