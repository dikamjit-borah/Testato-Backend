import { Body, Controller, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
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
            message: Constants.SOMETHING_WENT_WRONG,
        }
        //console.log(""+JSON.stringify(req)); y do not wokr circular reference
        console.log(signUpDto);

        //let requiredParametersCheck: any = BasicUtils.requiredParametersCheck(signUpDto, ["phoneNumber", "password"])
        //if (requiredParametersCheck["requiredParametersCheck"]) {

        let isUserCreated = await this.authService.createUser(signUpDto)
        if (isUserCreated && isUserCreated["userCreated"]) {
            responseData.message = Constants.USER_CREATED
            return res
                .status(HttpStatus.OK)
                .send(responseData)
        }
        else {
            if (isUserCreated && isUserCreated["error"]) {
                responseData.message = isUserCreated["error"]
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(responseData)
            }
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseData)
        }
        //}
        /* else
        {
            if(requiredParametersCheck["errors"]!=null)
            {
                responseData.message = ""+requiredParametersCheck["errors"]
                return res
                .status(HttpStatus.BAD_REQUEST)
                .send(responseData)
                
            }
        } */
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(responseData)

    }


}
