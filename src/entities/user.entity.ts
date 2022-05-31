import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, default: null})
    phoneNumber:number

    @Column({nullable: true, default: null})
    password?:String
}
