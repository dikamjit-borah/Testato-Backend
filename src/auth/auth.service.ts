import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/dto/SignUpDto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(SignUpDto) private signUpRepo: Repository<SignUpDto>) { }

    async createUser(signUpDto:SignUpDto) {
        console.log("taki taki");
        return true
        
    }

}
