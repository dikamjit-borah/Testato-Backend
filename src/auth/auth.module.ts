import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignUpDto } from 'src/dto/SignUpDto';

@Module({
  imports:[TypeOrmModule.forFeature([SignUpDto])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
