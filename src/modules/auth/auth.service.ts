import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/dto/SignInDto';
import { SignUpDto } from 'src/dto/SignUpDto';
import { UserEntity } from 'src/db/entities/user.entity';
import { BasicUtils } from 'src/utils/BasicUtils';
import { getConnection, Repository } from 'typeorm';
import { UserDetailsEntity } from 'src/db/entities/userDetails.entity';
import { async } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(UserDetailsEntity) private userDetailsRepo: Repository<UserDetailsEntity>
    ) { }

    async createUser(signUpDto: SignUpDto) {
        let userCreated = false;
        const queryRunner = await getConnection().createQueryRunner();
        try {
            const userExists = await this.userRepo.findOneBy({
                phoneNumber: signUpDto.phoneNumber
            })

            if (userExists && userExists.phoneNumber) {
                userCreated = false
                return {
                    userCreated,
                    userExists
                }
            }
            const hashedPassword = await BasicUtils.encodePassword(signUpDto.password)
            console.log("hashed password: \n" + hashedPassword);

            const newUser = this.userRepo.create({ ...signUpDto, password: "" + hashedPassword });

            await queryRunner.startTransaction();
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('user_entity')
                .values(newUser)
                .execute()

            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('user_details_entity')
                .values(signUpDto)
                .execute()

            await queryRunner.commitTransaction();
            console.log("new user created: \n" + JSON.stringify(newUser));
            await queryRunner.release()
            return {
                userCreated: true,
                newUser
            }

        } catch (error) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return {
                userCreated,
                error
            }
        }
    }

    async findUser(signInDto: SignInDto) {
        let userFound = false;
        try {
            const user = await this.userRepo.findOneBy({ phoneNumber: signInDto.phoneNumber })
            if (user)
                return {
                    userFound: true,
                    user
                }
            return {
                userFound,
                user
            }


        } catch (error) {
            return {
                userFound,
                error
            }
        }

    }

}
