import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './modules/login/login.controller';

@Module({
  imports: [],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}
