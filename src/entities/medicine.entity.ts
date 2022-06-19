import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class MedicineEntity{

/* @Column()
@PrimaryGeneratedColumn()
id: number;
 */

@Column({
    type:'varchar',
    name:'medicine_id',
    primary:true,
    nullable:false,
})
medicineId:string

@Column({
    type:'varchar',
    name:'medicine_name',
})
medicineName: string

@Column({
    type:'varchar',
    name:'available_pharmacies',
    nullable:false
})
availablePharmacies: String

}
