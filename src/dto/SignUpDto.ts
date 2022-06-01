import { isNotEmpty, IsNotEmpty } from "class-validator"

export class SignUpDto{
    @IsNotEmpty()
    phoneNumber:number

    @IsNotEmpty()
    password:string

    //clientType 

    //if pharmacy, location, name, 
}