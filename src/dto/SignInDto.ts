import { isNotEmpty, IsNotEmpty } from "class-validator"

export class SignInDto{
    @IsNotEmpty()
    phoneNumber:number

    @IsNotEmpty()
    password:string

    //clientType 
}