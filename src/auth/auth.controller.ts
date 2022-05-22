import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SignUpDto } from 'src/dto/SignUpDto';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('/signUp')
    signUp(@Body() signUpDto:SignUpDto, @Res() response) {
        let responseData = {
            message:Constants.SOMETHING_WENT_WRONG,
        }
        console.log(""+JSON.stringify(signUpDto));
        
        let requiredParametersCheck:any = BasicUtils.requiredParametersCheck(signUpDto, ["phoneNumber", "password"])
        if(requiredParametersCheck["requiredParametersCheck"]){

            let userCreated = this.authService.createUser(signUpDto)
            if(userCreated)
            {
                responseData.message = Constants.USER_CREATED
                return response
                .status(HttpStatus.OK)
                .send(responseData)
            }
            else{
                return response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(responseData)
            }
            
        }
        else
        {
            if(requiredParametersCheck["errors"]!=null)
            {
                responseData.message = ""+requiredParametersCheck["errors"]
                return response
                .status(HttpStatus.BAD_REQUEST)
                .send(responseData)
                
            }
        }
        return response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(responseData)

    }


}
