import { TransformStringToInteger } from "src/helper/transform-string-to-integer";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
@Index(['correlativeSerie','correlativeYear'],{unique:true})
export class Correlative{
    @PrimaryColumn('text')   
    correlativeSerie:string;

    @PrimaryColumn('numeric')
    correlativeYear:number;

    @Column('numeric', {     
        transformer: new TransformStringToInteger(),
    })
    correlativeNumber:number
}