import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async, map } from 'rxjs';
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

    async fetchMedicineDetails(medicineName: any, city: any, longitude:any, latitude:any) {
        let detailsAvailable = false
        try {
            const index = await client.initIndex("med");

            const searchResults = await index.search(medicineName,{
                filters:`city:${city}`
            });

            let pharmacyIds= new Set();
            searchResults.hits.forEach(pharmacy=>{
                const stringifyResult = JSON.stringify(pharmacy)
                pharmacyIds.add(JSON.parse(stringifyResult).phId)
            })


            let pharmacyData = await this.medicineRepo.find({});
            let finalPharmaciesData=[]

            finalPharmaciesData = pharmacyData.map(async pharmacy=>{
                const pharmacyObj={}
                let distance = 0;
                // distance calculation based on given longi and lati
                const medicineDetails = await this.medicineDetailsRepo.findOneBy({ })
                return {
                    ...pharmacy,
                    distance,
                    medicineDetails
                }
            })


            if (finalPharmaciesData.length) {
                detailsAvailable = true
                return ({
                    detailsAvailable,
                    finalPharmaciesData
                })
            }



            // const medicineDetails = await this.medicineDetailsRepo.findOneBy({
            //     medicineId
            // })

            

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

    async searchForMedicine(queryString: string) {
        let medicineFound = false;
        const index = await client.initIndex("med");
        const MedicineSet = new Set()
        try {
            const searchResults = await index.search(queryString);
            medicineFound = true
            searchResults.hits.forEach(element => {
                const stringifyResult = JSON.stringify(element)
                MedicineSet.add(JSON.parse(stringifyResult).key);
            });
            return {
                uniqueMedicineNames: Array.from(MedicineSet),
                medicineFound
            }


            // const query = `SELECT medicine_id, medicine_name from medicine_entity WHERE medicine_name LIKE "%${queryString}%"`
            // let medicines = await this.medicineRepo.query(query)
            

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
            const medicineIds = [], medicineEntityArr=[], medicineDetailEntityArr = [];
            for (let index = 0; index < medicineDtoList.length; index++) {
                const item = medicineDtoList[index];
                medicineIds.push(item.medicineId)
                medicineEntityArr.push({medicine_id: item.medicineId, medicine_name: item.medicineName, pharmacy_id: pharmacyId})
                medicineEntityArr.push({
                                        medicine_id: item.medicineId, 
                                        medicine_name: item.medicineName, 
                                        medicine_mrp: item.medicineMrp,
                                        medicine_manufacturer: item.medicineManufacturer,
                                        medicine_composition: item.medicineComposition,
                                        medicine_packing_type: item.medicinePackingType,
                                        medicine_packaging: item.medicinePackaging 
                                    })
            }

            await queryRunner.manager.query("Delete From Medicine where medicine_id In (?)",[medicineIds])
            await queryRunner.manager.query("Delete From MedicineDetail where medicine_id In (?)",[medicineIds])

            this.medicineRepo.createQueryBuilder()
            .insert()
            .into(MedicineEntity)
            .values(medicineEntityArr)
            .execute();

            this.medicineDetailsRepo.createQueryBuilder()
            .insert()
            .into(MedicineDetailsEntity)
            .values(medicineDetailEntityArr)
            .execute();



            medicinesUpdated = true
            return { medicinesUpdated }

        } catch (error) {
            return { medicinesUpdated, error }
        }
    }

    async updateMedicinesInSearchEngine(medArr: any, pharmacyId){
        try{
            const index = await client.initIndex("med");

            // index.deleteBy({
            //     filters: `phId=${pharmacyId}`
            //   })
            //   .then(async() => {
            //     await index.saveObjects(medArr)
            //  })
            //   .catch(err=>console.log(err)); 

            const data = await index.search('para',{
                filters:'city:fsdafa'
            });
            const final = JSON.stringify(data.hits[0])
            console.log(JSON.parse(final).key)

            
        }catch(err){
            console.log(err,"errrerere")
        }
    }
}


/*  await Promise.all(queries.map((query)=>{
             console.log(query);
             queryRunner.manager.query(query)
         })) */
