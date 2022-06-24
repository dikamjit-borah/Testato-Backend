require('dotenv').config

import { Module} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from 'typeormConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { UserModule } from './modules/user/user.module';
import { JwtStrategyForAuth } from './passport/jwt.strategy';
import { LocationModule } from './modules/location/location.module';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './modules/search/search.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    PassportModule, 
    HttpModule,
    AuthModule, 
    MedicineModule, 
    UserModule,
    LocationModule,
    SearchModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategyForAuth],
})
export class AppModule {} 