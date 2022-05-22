import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SignUpDto } from 'src/dto/SignUpDto';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';

@Controller('auth')
export class AuthController {

    @Post('/signUp')
    signUp(@Body() signUpDto:SignUpDto, @Res() response) {
        let responseData = {
            message:Constants.SOMETHING_WENT_WRONG,
        }
        console.log(""+JSON.stringify(signUpDto));
        
        let requiredParametersCheck:any = BasicUtils.requiredParametersCheck(signUpDto, ["phoneNumber", "password"])
        if(requiredParametersCheck["requiredParametersCheck"]){
            responseData.message = Constants.USER_CREATED
            response
                .status(HttpStatus.OK)
                .send(responseData)
        }
        else
        {
            if(requiredParametersCheck["errors"]!=null)
            {
                responseData.message = ""+requiredParametersCheck["errors"]
                response
                .status(HttpStatus.BAD_REQUEST)
                .send(responseData)
                
            }
        }
        return response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(responseData)

    }


}
