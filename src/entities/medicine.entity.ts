import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class MedicineEntity{

@Column()
@PrimaryGeneratedColumn()
id: number;

@Column()
medicineName: string

}
