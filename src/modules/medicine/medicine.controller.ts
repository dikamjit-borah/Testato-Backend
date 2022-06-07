import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtGuardForAuth } from 'src/passport/jwt.guard';
import { Constants } from 'src/utils/Constants';

@Controller('medicine')
export class MedicineController {
    @UseGuards(JwtGuardForAuth)
    @Get(':id')
    async findMedicineById(@Query('id') id:number){
        console.log("yoyoyoyo");
        return {
            statusCode:600,
            message:"all good"
        }
    }

    @MessagePattern(Constants.RabbitMqConfig.MEDICINE_DATA_PATERN)
    async updateMedicineData(@Payload() data: {}, @Ctx() context: RmqContext){

        console.log("Fetching updated medicine data from rabbitmq");
        data['medicineData'].forEach(element => {
            console.log(element['Product Name']);
             
        });
    }
}
