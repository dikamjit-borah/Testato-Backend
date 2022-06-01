import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategyForAuth extends PassportStrategy(Strategy){
    constructor(){
        super({
            secretOrKey: 'JWT_SECRET',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false
        })
    }
    async validate(payload: any){

        return {
            phoneNumber: payload.phoneNumber
        }
    }
}

