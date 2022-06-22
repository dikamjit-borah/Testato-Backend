import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineEntity } from 'src/db/entities/medicine.entity';
import { MedicineDetailsEntity } from 'src/db/entities/medicineDetails.entity';
import { UserDetailsEntity } from 'src/db/entities/userDetails.entity';
import { Constants } from 'src/utils/Constants';
import { LocationService } from '../location/location.service';
import { UserService } from '../user/user.service';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MedicineEntity, MedicineDetailsEntity, UserDetailsEntity]),
    ClientsModule.register([{
      name: 'FETCH_MEDICINE_DATA',
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.RMQ_QUEUE_PREFIX + "_" + Constants.RabbitMqConfig.MEDICINE_DATA_QUEUE,
        queueOptions: {
          durable: true
        },
        noAck: false,
      }
    }
    ])
  ],
  controllers: [MedicineController],
  providers: [MedicineService, UserService, LocationService]
})
export class MedicineModule { }
