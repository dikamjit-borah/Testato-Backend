import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/dto/SignUpDto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async createUser(signUpDto:SignUpDto) {
        let userCreated;
        try {
            userCreated = await this.userRepo.save(signUpDto)
            console.log("User created: "+userCreated);
            
        } catch (error) {
            console.log(error);
            return {userCreated, error:""+error}
            
        }
                
        return {userCreated}
        
    }

}
