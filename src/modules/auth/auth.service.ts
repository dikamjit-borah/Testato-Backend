import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/dto/SignInDto';
import { SignUpDto } from 'src/dto/SignUpDto';
import { UserEntity } from 'src/entities/user.entity';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
        ) { }

    async createUser(signUpDto:SignUpDto) {
        let userCreated = false;
        try {
            const hashedPassword = await BasicUtils.encodePassword(signUpDto.password)
            console.log("hashed password: \n"+hashedPassword);
            
            const newUser = this.userRepo.create({...signUpDto, password:""+hashedPassword});
            await this.userRepo.save(newUser)
            console.log("new user created: \n"+ JSON.stringify(newUser));
            return {
                userCreated: true,
                newUser
            }
            
        } catch (error) {
            console.log(error);
            return {
                userCreated, 
                error:""+error
            }
            
        }
    }

    async findUser(signInDto:SignInDto){
        let userFound = false;
        try {
            const user = await this.userRepo.findOneBy({phoneNumber:signInDto.phoneNumber})
            if(user)
            return {
                userFound: true,
                user
            }
            return {
                userFound,
                user
            }
            
            
        } catch (error) {
            return{
                userFound,
                error
            }
        }

    }

}
