import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Workday{
    @PrimaryGeneratedColumn('uuid')    
    workdayId:                  string;
    
    @Column("numeric")    
    workdayHoursDay:            number;

    @Column("numeric")    
    workdayDaysWeek:            number;

    @Column("text")
    workdayDescription:         string;
}