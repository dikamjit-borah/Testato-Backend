import { HttpCode, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Constants } from "src/utils/Constants";

@Injectable()
export class ValidateRequestMiddleware implements NestMiddleware{
    use(req: any, res: any, next: (error?: any) => void) {
        
        let responseData = {
            statusCode:HttpStatus.INTERNAL_SERVER_ERROR,
            message:Constants.SOMETHING_WENT_WRONG
        }

        let headers = req.headers
        console.log("Request Headers: \n" + JSON.stringify(headers));
        
        if(this.isValidRequest(headers)){
            next()
        }
        else{
            responseData.statusCode = HttpStatus.UNAUTHORIZED
            responseData.message = Constants.USER_UNAUTHORIZED;
            return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .send(responseData)
        }

        //throw new Error("Method not implemented.");
    }

    isValidRequest(headers:string) {
        return true;
    }

}