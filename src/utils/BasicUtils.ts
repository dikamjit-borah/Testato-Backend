import * as bcrypt from 'bcrypt';
export class BasicUtils{
    static requiredParametersCheck(requestObj, parametersArray) {

        let requiredParametersCheck:boolean = true
        let errors = []

        parametersArray.map(parameterName=>{
            if(!(requestObj && requestObj[parameterName])){
                errors.push(`${parameterName} is missing`)
                requiredParametersCheck = false
            }
        })

    
        return {
            requiredParametersCheck,
            errors
        };
    }

    static async encodePassword(userPassword: string){
        const SALT = bcrypt.genSaltSync();
        return bcrypt.hash(userPassword, SALT)
    }

    static validatePassword(userPassword: string, hashedPassword: string){
        return bcrypt.compareSync(userPassword, hashedPassword)
    }

    static generateErrorResponse(){
        
    }

    static simpleStringify(object) {
        var simpleObject = {};
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) == 'object') {
                continue;
            }
            if (typeof (object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        return JSON.stringify(simpleObject); // returns cleaned up JSON
    }
}
