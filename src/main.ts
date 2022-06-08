require('dotenv').config()

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { BasicUtils } from './utils/BasicUtils';
import { Constants } from './utils/Constants';

const PORT = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  const testatoErp = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: `${process.env.RMQ_QUEUE_PREFIX}_${Constants.RabbitMqConfig.MEDICINE_DATA_QUEUE}`,
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
