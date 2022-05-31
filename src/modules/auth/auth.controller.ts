import { Body, Controller, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInDto } from 'src/dto/SignInDto';
import { SignUpDto } from 'src/dto/SignUpDto';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @UsePipes(ValidationPipe)
    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto, @Res() res) {
        let responseData = {
            statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
            message: Constants.SOMETHING_WENT_WRONG,
        }
        console.log(signUpDto);

        let isUserCreated = await this.authService.createUser(signUpDto)
        if (isUserCreated && isUserCreated["userCreated"]) {
            responseData.statusCode = HttpStatus.OK
            responseData.message = Constants.USER_CREATED
            return res
                .status(HttpStatus.OK)
                .send(responseData)
        }
        else {
            if (isUserCreated && isUserCreated["error"]) {
                responseData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
                responseData.message = isUserCreated["error"]
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseData)
            }
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseData)
        }
    }

    @UsePipes(ValidationPipe)
    @Post('/signIn')
    async signIn(@Body() signInDto: SignInDto, @Res() res) {
        let responseData = {
            statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
            message: Constants.SOMETHING_WENT_WRONG,
        }
        console.log(signInDto);

        let isUserFound = await this.authService.findUser(signInDto)
        if (isUserFound && isUserFound["userFound"]) {

            const hashedPassword = isUserFound["user"]["password"]
            if(BasicUtils.validatePassword(signInDto.password, ""+hashedPassword))
            {
                responseData.statusCode = HttpStatus.OK
                responseData.message = Constants.LOGIN_SUCCESS
                return res
                    .status(HttpStatus.OK)
                    .send(responseData)
            }
            else{
                responseData.statusCode = HttpStatus.UNAUTHORIZED
                responseData.message = Constants.LOGIN_FAILED
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .send(responseData)
            }
            
        }
        else {
            if(isUserFound["error"]){
                responseData.message = isUserFound["error"]
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseData)
            }
            
            responseData.statusCode = HttpStatus.UNAUTHORIZED
            responseData.message = Constants.USER_NOT_FOUND
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .send(responseData)
            
        }
    }
}
