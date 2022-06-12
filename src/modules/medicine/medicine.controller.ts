import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtGuardForAuth } from 'src/passport/jwt.guard';
import { Constants } from 'src/utils/Constants';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {

    constructor(private medicineService: MedicineService ){

    }



   // @UseGuards(JwtGuardForAuth)
    @Get(':id')
    async findMedicineById(@Query('id') id: number) {
       
        this.medicineService.updateMedicinesInDb()
        
        return {
            statusCode: 600,
            message: "all good"
        }
    }

    @MessagePattern(Constants.RabbitMqConfig.MEDICINE_DATA_PATTERN)
    async updateMedicineData(@Ctx() context: RmqContext) {

        console.log("Fetching updated medicine data from rabbitmq");

        let { content } = context.getMessage()
        const channel = context.getChannelRef();
        content = JSON.parse(content.toString())

        if(content.data && content.data['pharmacyId'])
            console.log("Updating medicine data for "+ content.data['pharmacyId']);
        channel.ack(context.getMessage())

        console.log("Ack sent");
        
    }

}
