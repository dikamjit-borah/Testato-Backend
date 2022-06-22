import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from "class-validator"

export class SignUpDto{
    @IsNotEmpty()
    @IsNumber()
    phoneNumber:number

    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    userName:String

    @IsNotEmpty()
    userType:String

    @IsNotEmpty()
    @IsLatitude()
    latitude:number

    @IsNotEmpty()
    @IsLongitude()
    longitude:number

    @IsNotEmpty()
    address:String

    @IsNotEmpty()
    city:String

    @IsNotEmpty()
    state:String
}