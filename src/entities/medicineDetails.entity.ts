import { Column, Entity } from "typeorm"

@Entity()
export class MedicineDetailsEntity {

    @Column({
        type:'varchar',
        name:'medicine_id',
        primary:true
    })
    medicineId: string

    @Column({
        type:'varchar',
        name:'medicine_name',
    })
    medicineName: string

    @Column({
        type:'float',
        name:'medicine_mrp',
    })
    medicineMrp: number

    @Column({
        type:'varchar',
        name:'medicine_manufacturer',
    })
    medicineManufacturer: string

    @Column({
        type:'varchar',
        name:'medicine_composition',
    })
    medicineComposition: string

    @Column({
        type:'varchar',
        name:'medicine_packing_type',
    })
    medicinePackingType: string

    @Column({
        type:'varchar',
        name:'medicine_packaging',
    })
    medicinePackaging: string
}
