import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { MedicineDto } from 'src/dto/MedicineDto';
import { MedicineEntity } from 'src/db/entities/medicine.entity';
import { MedicineDetailsEntity } from 'src/db/entities/medicineDetails.entity';
import { EntityManager, getConnection, Repository } from 'typeorm';

@Injectable()
export class MedicineService {

    constructor(
        @InjectRepository(MedicineEntity) private medicineRepo: Repository<MedicineEntity>,
        @InjectRepository(MedicineDetailsEntity) private medicineDetailsRepo: Repository<MedicineDetailsEntity>
    ) { }

    async fetchMedicineDetails(medicineId: any) {
        let detailsAvailable = false
        try {
            const medicineDetails = await this.medicineDetailsRepo.findOneBy({
                medicineId
            })

            if (medicineDetails) {
                detailsAvailable = true
                return ({
                    detailsAvailable,
                    medicineDetails
                })
            }

            return ({
                detailsAvailable
            })


        } catch (error) {
            return {
                detailsAvailable,
                error
            }
        }

    }

    async fetchAvailablePharmacies(medicineId: any) {
        let pharmaciesFound = false
        try {
            const data = await this.medicineRepo.findOneBy({
                medicineId
            })

            if (data && data.availablePharmacies) {
                pharmaciesFound = true
                return {
                    pharmaciesFound,
                    availablePharmacies: data.availablePharmacies
                }
            }
            return {
                pharmaciesFound
            }
        } catch (error) {
            return {
                pharmaciesFound,
                error
            }
        }
    }

    async searchMedicineInDb(queryString: string) {
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

    async updateMedicinesInDb(medicineDtoList: MedicineDto[]) {
        let medicinesUpdated = false
        const queryRunner = await getConnection().createQueryRunner();

        try {

            for (let index = 0; index < medicineDtoList.length; index++) {
                const item = medicineDtoList[index];
                await queryRunner.manager.query(`CALL SP_UPDATE_MEDICINE_DATA (?, ?, ?, ?, ?, ?, ?, ?);`,
                    [
                        item.medicineId,
                        item.medicineName,
                        item.availablePharmacies,
                        item.medicineMrp,
                        item.medicineManufacturer,
                        item.medicineComposition,
                        item.medicinePackingType,
                        item.medicinePackaging])
            }

            medicinesUpdated = true
            return { medicinesUpdated }

        } catch (error) {
            return { medicinesUpdated, error }
        }
    }
}


/*  await Promise.all(queries.map((query)=>{
             console.log(query);
             queryRunner.manager.query(query)
         })) */
