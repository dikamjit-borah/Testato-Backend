import { Column, Entity } from "typeorm"

@Entity()
export class MedicineDetailsEntity {

    @Column({
        type:'varchar',
        name:'medicine_id',
        primary:true,
        nullable:false
    })
    medicineId: string

    @Column({
        type:'varchar',
        name:'medicine_name',
        nullable:false
    })
    medicineName: string

    @Column({
        type:'float',
        name:'medicine_mrp',
        nullable:true
    })
    medicineMrp: number

    @Column({
        type:'varchar',
        name:'medicine_manufacturer',
        nullable:true
    })
    medicineManufacturer: string

    @Column({
        type:'varchar',
        name:'medicine_composition',
        nullable:true
    })
    medicineComposition: string

    @Column({
        type:'varchar',
        name:'medicine_packing_type',
        nullable:true
    })
    medicinePackingType: string

    @Column({
        type:'varchar',
        name:'medicine_packaging',
        nullable:true
    })
    medicinePackaging: string
}
