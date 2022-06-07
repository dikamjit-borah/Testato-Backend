import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Constants } from 'src/utils/Constants';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'FETCH_MEDICINE_DATA',
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE_PREFIX + "_" + Constants.RabbitMqConfig.MEDICINE_DATA_QUEUE,
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
