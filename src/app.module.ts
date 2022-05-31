import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { type } from 'os';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidateRequestMiddleware } from './middlewares/validateRequestMiddleware';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "",
    database: "testato_database",
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true
  }
  ), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
/* implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateRequestMiddleware).forRoutes(AuthController)}}
 */
