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
    conceptCode:string;
    @Column('text')
    conceptDescription:string;
    @Column('bool')
    conceptIsCalculated:boolean;
    
    @ManyToOne(()=>TypeConcept,typeConcept=>typeConcept.typeConceptId)
    @JoinColumn({name:'typeConceptId'})
    typeConcept:TypeConcept;
}