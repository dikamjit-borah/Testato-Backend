import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async createUser(userEntity:UserEntity) {
        let userCreated;
        try {
            userCreated = await this.userRepo.save(userEntity)
        } catch (error) {
            console.log(error);
            return {userCreated, error:""+error}
            
        }
                
        return {userCreated}
        
    }

}
