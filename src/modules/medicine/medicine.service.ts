import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { MedicineDto } from 'src/dto/MedicineDto';
import { MedicineEntity } from 'src/db/entities/medicine.entity';
import { MedicineDetailsEntity } from 'src/db/entities/medicineDetails.entity';
import { EntityManager, getConnection, Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';
const client = algoliasearch("KX2ICK21L8","6e76cfeb0238960bbd52e17491fd72b7")

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

    async searchForMedicineInDb(queryString: string) {
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

    async updateMedicinesInDb(medicineDtoList: MedicineDto[], pharmacyId) {
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

    async updateMedicinesInSearchEngine(medArr: any, pharmacyId){
        try{
            const index = await client.initIndex("med");
            //console.log(index)
           // await index.saveObjects(medArr)
            
            // index.search('para', {
            //     filters: 'city:Guwahati'
            // }).then(({ hits }) => {
            //     console.log(hits);
            // }).catch(err=> console.log(err));

            index.deleteBy({
                filters: 'phId=2'
              }).then(() => {
                // done
                console.log("done")
             });
        }catch(err){
            console.log(err,"errrerere")
        }
    }
}


/*  await Promise.all(queries.map((query)=>{
             console.log(query);
             queryRunner.manager.query(query)
         })) */
