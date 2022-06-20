require('dotenv').config()
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyForAuth } from 'src/passport/jwt.strategy';


@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]), 
    PassportModule,  
    JwtModule.register(
    {
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:process.env.JWT_EXPIRY}
    }
  )],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyForAuth]
})
export class AuthModule{}