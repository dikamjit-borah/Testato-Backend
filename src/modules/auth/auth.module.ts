import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategyForAuth } from 'src/passport/jwt.strategy';


@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]), 
    PassportModule,  
    JwtModule.register(
    {
      secret:'JWT_SECRET',
      signOptions:{expiresIn:3400}
    }
  )],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyForAuth]
})
export class AuthModule{}