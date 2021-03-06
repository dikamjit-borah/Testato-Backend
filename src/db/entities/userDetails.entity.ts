import { Column, Entity } from "typeorm"

@Entity()
export class UserDetailsEntity {

    @Column({
        type:'bigint',
        name:'phone_number',
        primary:true,
        nullable: false,
    })
    phoneNumber:number

    @Column({
        type:'varchar',
        name:'user_name',
        nullable: false
    })
    userName:String

    @Column({
        type:'float',
    })
    latitude:number

    @Column({
        type:'float',
    })
    longitude:number

    @Column({
        type:'varchar',
    })
    address:String

    @Column({
        type:'varchar',
    })
    city:String

    @Column({
        type:'varchar',
    })
    state:String
}
