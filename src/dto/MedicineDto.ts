import { isNotEmpty, IsNotEmpty } from "class-validator"

export class MedicineDto{
    medicineId:number
    medicineName:string
    medicineDescription: string
    medicineMrp: number
    medicineManufacturer: string
    medicineComposition: string
    medicinePackingType: string
    medicinePackaging: string
    availablePharmacies: string
}