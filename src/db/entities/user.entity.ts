import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

    @Column({
        type:'bigint',
        name:'phone_number',
        primary:true,
        nullable: false
    })
    phoneNumber:number

    @Column({
        type:'varchar',
        name:'password',
        nullable: false
    })
    password:String

    @Column({
        type:'varchar',
        name:'user_type',
        nullable: false,
    })
    userType:String
}
