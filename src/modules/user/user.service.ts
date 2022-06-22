import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailsEntity } from 'src/db/entities/userDetails.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {


    constructor(@InjectRepository(UserDetailsEntity) private userDetailsRepo: Repository<UserDetailsEntity>){

    }

    async fetchUserDetails(userId: any)
    {
        console.log("Fetching details of user ", userId);
        
        let detailsAvailable = false
        try {
            const userDetails = await this.userDetailsRepo.findOneBy({
                phoneNumber:userId
            })
            if(userDetails){
                detailsAvailable = true
                return ({
                    detailsAvailable,
                    userDetails
                })
            }
        } catch (error) {
            return {
                detailsAvailable,
                error
            }
        }
    }

    async fetchUserDetailsByCity(userCity: any){
        console.log("Fetching details of users in city "+ userCity);
        
    }
}
