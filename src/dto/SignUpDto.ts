import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class SignUpDto{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 15 })
    phoneNo:number
    @Column({length: 25})
    password:String
}