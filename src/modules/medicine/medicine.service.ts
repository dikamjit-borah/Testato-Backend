import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicineEntity } from 'src/entities/medicine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicineService {

    constructor(
        @InjectRepository(MedicineEntity) private medicineRepo:Repository<MedicineEntity>
    ){ }
  
    async updateMedicinesInDb() {
        let medicinesUpdated = false
        try{

            console.log("sexxkk");
            const medicine = await this.medicineRepo.query(`CALL SP-UPDATE_MEDICINE_DATA`)
            //const medicine = await this.medicineRepo.query(`CALL SP-UPDATE_MEDICINE_DATA`)
             
            console.log(medicine);
            return;
            
            
        }catch(err)
        {
            console.log(err);
            
        }
    }
}

