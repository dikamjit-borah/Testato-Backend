import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"bigint",
        name:'phone_number',
        nullable: false
    })
    phoneNumber:number

    @Column({
        type:"varchar",
        name:'password',
        nullable: false
    })
    password:String
}
