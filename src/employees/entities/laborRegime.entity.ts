import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class LaborRegime{
    @PrimaryGeneratedColumn('uuid')    
    laborRegimeId:                 string;
    
    @Index({ unique: true })
    @Column("text")    
    laborRegimeCode:               string;

    @Column("text")
    laborRegimeName:               string;

    @Column("text")
    laborRegimeDescription:        string;
}