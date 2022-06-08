require('dotenv').config

import { Module} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MedicineModule } from './modules/medicine/medicine.module';
import { JwtStrategyForAuth } from './passport/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
    type: process.env.DB_TYPE as any, 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USERNAME,
    password: "",
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true
  }
  ),PassportModule, AuthModule, MedicineModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategyForAuth],
})
export class AppModule {} 
/* implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateRequestMiddleware).forRoutes(AuthController)}}
 */
