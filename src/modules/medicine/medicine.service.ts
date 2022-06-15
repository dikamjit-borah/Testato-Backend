import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicineDto } from 'src/dto/MedicineDto';
import { MedicineEntity } from 'src/entities/medicine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicineService {

constructor(
    @InjectRepository(MedicineEntity) private medicineRepo:Repository<MedicineEntity>
){ }

async searchForMedicineInDb(queryString:string){
    console.log();
    
    let medicineFound = false
    try {
        const query = `SELECT medicine_id, medicine_name from medicine_entity WHERE medicine_name LIKE "%${queryString}%"`
        let medicines = await this.medicineRepo.query(query)      
        medicineFound = true
        return {
            medicineFound,
            medicines
        }
          
    } catch (error) {
        console.log(error);
        return {
            medicineFound,
            error
        }
    }

}

async updateMedicinesInDb(medicineDtoList:MedicineDto[]) {
    let medicinesUpdated = false
    try{
        await this.medicineRepo
            .createQueryBuilder()
            .insert()
            .into('medicine_entity')
            .values(medicineDtoList)
            .orUpdate(["is_updated"]) // is_updated becomes 1, pharmacy_ids column is updated/appended with new pharm id
            .execute()
            
        medicinesUpdated = true
        return {medicinesUpdated}
    }catch(error)
    {
        return {medicinesUpdated, error}
    }
}
}

