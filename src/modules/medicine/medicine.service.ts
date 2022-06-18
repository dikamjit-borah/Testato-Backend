import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicineDto } from 'src/dto/MedicineDto';
import { MedicineEntity } from 'src/entities/medicine.entity';
import { MedicineDetailsEntity } from 'src/entities/medicineDetails.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class MedicineService {

    constructor(
        @InjectRepository(MedicineEntity) private medicineRepo: Repository<MedicineEntity>,
        @InjectRepository(MedicineDetailsEntity) private medicineDetailsRepo: Repository<MedicineDetailsEntity>
    ) { }

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
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('medicine_entity')
                .values(medicineDtoList)
                .orUpdate(["is_updated"])
                .execute()

            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('medicine_details_entity')
                .values(medicineDtoList)
                .orUpdate(["is_updated"])
                .execute()

            await queryRunner.commitTransaction();
            medicinesUpdated = true
            return { medicinesUpdated }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return { medicinesUpdated, error }
        }
    }
}

