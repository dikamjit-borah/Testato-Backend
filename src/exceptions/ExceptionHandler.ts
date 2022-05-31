import { HttpException, HttpStatus } from "@nestjs/common";

export class ExceptionHandler extends HttpException{
    constructor(message:String, status:HttpStatus){
        super(message, status);
    }
}