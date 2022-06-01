import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuardForAuth } from 'src/passport/jwt.guard';

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
}
