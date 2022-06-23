import { Body, Controller, Get, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/dto/SignInDto';
import { SignUpDto } from 'src/dto/SignUpDto';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService, 
        private jwtService: JwtService) { }

    @UsePipes(ValidationPipe)
    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto, @Res() res) {
        
        let isUserCreated = await this.authService.createUser(signUpDto)

        if (isUserCreated) {
            if (isUserCreated['userCreated']) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.USER_CREATED))
            else if (isUserCreated['userExists']) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.USER_EXISTS))
            else if (isUserCreated['error']) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, Constants.Messages.USER_NOT_CREATED, { error: isUserCreated['error'] }))

        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }


    @UsePipes(ValidationPipe)
    @Post('/signIn')
    async signIn(@Body() signInDto: SignInDto, @Res() res) {
        let responseData = {
            statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
            message: Constants.Messages.SOMETHING_WENT_WRONG,
        }
        console.log(signInDto);

        let isUserFound = await this.authService.findUser(signInDto)
        if (isUserFound && isUserFound['userFound']) {

            const hashedPassword = isUserFound['user']['password']
            if(BasicUtils.validatePassword(signInDto.password, ""+hashedPassword))
            {
                const access_token = await this.loginUser(signInDto)
                responseData.statusCode = HttpStatus.OK
                responseData.message = Constants.Messages.LOGIN_SUCCESS
                responseData['access_token'] = access_token
                return res
                    .status(HttpStatus.OK)
                    .send(responseData)
            }
            else{
                responseData.statusCode = HttpStatus.UNAUTHORIZED
                responseData.message = Constants.Messages.LOGIN_FAILED
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .send(responseData)
            }
            
        }
        else {
            if(isUserFound['error']){
                responseData.message = isUserFound['error']
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseData)
            }
            
            responseData.statusCode = HttpStatus.UNAUTHORIZED
            responseData.message = Constants.Messages.USER_NOT_FOUND
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .send(responseData)
            
        }
    }

    async loginUser(user: any){
        
        const payload = {
            name: user.phoneNumber,
            sub:user.phoneNumber
        }

        return await this.jwtService.signAsync(payload)
    }
}
