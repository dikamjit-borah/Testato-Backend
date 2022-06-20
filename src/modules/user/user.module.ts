import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailsEntity } from 'src/db/entities/userDetails.entity';
import { UserService } from './user.service';

@Module({
  imports:[TypeOrmModule.forFeature([UserDetailsEntity])],
  providers: [UserService]
})
export class UserModule {}
