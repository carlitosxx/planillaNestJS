import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    authId: string;

    @Column("text")
    authFullname:    string;

    @Column("text",{unique:true})
    authEmail:      string;

    @Column("text")
    authPassword:        string;

    @Column("bool",{
        default:true})
    authStatus:     boolean;

    @Column('text',{
        array:true,
        default:['user']
    })    
    authRole:   string[];
    
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.authEmail=this.authEmail.toLocaleLowerCase().trim();
    }
    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
