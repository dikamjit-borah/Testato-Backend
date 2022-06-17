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

    async updateMedicinesInDb(pharmacyId: number, medicineDtoList: MedicineDto[]) {
        let medicinesUpdated = false
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {

            
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('medicine_entity')
                .values(medicineDtoList)
                .orUpdate({ columns: [ "available_pharmacies" ] }).setParameter("available_pharmacies", `%CONCAT('available_pharmacies', ${pharmacyId})%`)
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


/* 
let VALUES = ``
            medicineDtoList.map((element)=>{
                element['medicine_id'] = `'${element['medicine_id']}'`
                element['medicine_name'] = `/'${element['medicine_name']}'/`
                element['available_pharmacies'] = `'${element['available_pharmacies']}'`
                VALUES += `(${Object.values(element)}), `
            })

            console.log("sexx"+ medicineDtoList);
            

            medicineDtoList.forEach((element)=>{
                VALUES += `(${JSON.stringify(element.medicineId)}, ${JSON.stringify(element.medicineName)}, ${JSON.stringify(pharmacyId)}), `
            })
            VALUES = VALUES.slice(0, -2)


            let element = medicineDtoList[1]
            VALUES += `(${JSON.stringify(element.medicineId)}, ${JSON.stringify(element.medicineName)}, ${JSON.stringify(pharmacyId)}), `

            
           // VALUES = "(' + Object.values(medicineDtoList[1]) + ')"
            const query = `INSERT INTO 'medicine_entity' ('medicine_id', 'medicine_name', 'available_pharmacies') VALUES ${VALUES}`
            await queryRunner.manager.query(query) */