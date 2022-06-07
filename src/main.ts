import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { BasicUtils } from './utils/BasicUtils';
import { Constants } from './utils/Constants';

require('dotenv').config()

const PORT = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  const testatoErp = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE_PREFIX + "_" + Constants.MEDICINE_DATA_QUEUE,
      queueOptions: {
         durable: true 
        },
      noAck: false,
    },
  });
  
  app.startAllMicroservices().then(()=>{
    console.log("Microservices setup successfully " + BasicUtils.simpleStringify(testatoErp));
    
  }).catch((err)=>{console.log(err);
  });
  app.listen(PORT).then(()=>{
    console.log("Application listening on port "+PORT);
    
  });
  
  
}
bootstrap();
