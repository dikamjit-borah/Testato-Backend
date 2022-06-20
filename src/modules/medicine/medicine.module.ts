import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineEntity } from 'src/db/entities/medicine.entity';
import { MedicineDetailsEntity } from 'src/db/entities/medicineDetails.entity';
import { Constants } from 'src/utils/Constants';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicineEntity, MedicineDetailsEntity]),
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
  providers: [MedicineService]
})
export class MedicineModule { }
