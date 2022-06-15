import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { isEmpty } from 'class-validator';
import { MedicineDto } from 'src/dto/MedicineDto';
import { JwtGuardForAuth } from 'src/passport/jwt.guard';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {

    constructor(private medicineService: MedicineService ){

    }



   // @UseGuards(JwtGuardForAuth)
    /* @Get(':id')
    async findMedicineById(@Query('id') id: number) {
       
        return {
            statusCode: 600,
            message: "all good"
        }
    } */

    @Get('search')
    async search(@Query('queryString') queryString: string, @Res() res){
        console.log("Search initiated for " + queryString);
        let results = await this.medicineService.searchForMedicineInDb(queryString)
        if(results){
            if(results['medicineFound'] && results['medicines'])
            {
                if(results['medicines'].length>0) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINES_FOUND, {results: results['medicines']}))
                return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINE_NOT_FOUND))
            }
            if(results['error'])
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, results['error']))
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    @MessagePattern(Constants.RabbitMqConfig.MEDICINE_DATA_PATTERN)
    async updateMedicineData(@Ctx() context: RmqContext) {

        console.log("Fetching updated medicine data from rabbitmq");

        let { content } = context.getMessage()
        const channel = context.getChannelRef();
        content = JSON.parse(content.toString())

        const data = content && content.data ? content.data : null
        const pharmacyId = data && data['pharmacyId'] ? data['pharmacyId'] : null
        const medicineData = data && data['medicineData'] ? data['medicineData'] : null

        if(pharmacyId){
            console.log("Parsing medicine data for " + pharmacyId);
            let medicineDtoList: MedicineDto[] = []
            if (medicineData && Array.isArray(medicineData) && medicineData.length != 0) {
                for (let i = 0; i < medicineData.length; i++) {
                    let medicine = medicineData[i];
                    let medicineDto: MedicineDto = new MedicineDto()
                    medicineDto.medicineId = medicine['Product ID']
                    medicineDto.medicineName = medicine['Product Name']
                    medicineDtoList.push(medicineDto)
                }
                let isMedicinesUpdated = await this.medicineService.updateMedicinesInDb(medicineDtoList)
                if (isMedicinesUpdated['medicinesUpdated']) {
                    console.log("Medicines updated successfully");
                    channel.ack(context.getMessage())
                    console.log("Ack sent");
                } else if (isMedicinesUpdated['error']) console.log("Medicines could not be updated due to " + isMedicinesUpdated['error']);
            }
        }
    }

}
