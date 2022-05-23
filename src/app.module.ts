import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { type } from 'os';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

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
