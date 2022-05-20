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
}