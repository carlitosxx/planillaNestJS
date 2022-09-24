import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class TypeConcept {
    @PrimaryGeneratedColumn('uuid')
    typeConceptId:string;
    @Column('text')
    typeConceptDescription:string;
}