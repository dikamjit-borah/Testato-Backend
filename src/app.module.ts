require('dotenv').config

import { Module} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from 'typeormConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { JwtStrategyForAuth } from './passport/jwt.strategy';
@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig),
    PassportModule, 
    AuthModule, 
    MedicineModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategyForAuth],
})
export class AppModule {} 