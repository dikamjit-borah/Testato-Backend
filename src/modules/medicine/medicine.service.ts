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

async updateMedicinesInDb(medicineDtoList:MedicineDto[]) {
    let medicinesUpdated = false
    try{
        await this.medicineRepo
            .createQueryBuilder()
            .insert()
            .into('medicine_entity')
            .values(medicineDtoList)
            .orUpdate(["is_updated"])
            .execute()
            
        medicinesUpdated = true
        return {medicinesUpdated}
    }catch(error)
    {
        return {medicinesUpdated, error}
    }
}
}

