import { BadRequestException } from "../common/response/failed.response.js"
import { signupschema } from "../module/auth/auth.validation.js"

     const reqData=["body","params","query"]

export const validation=(schema)=>{
    return (req,res,next)=>{
        const validationErrors=[]
        reqData.forEach(ele=>{
            if(schema[ele]){
    const validationRes=schema[ele].validate(req[ele],{abortEarly:false})
            if(validationRes.error){
                validationErrors.push(validationRes.error)
            }
            }

        })
        console.log(validationErrors);
        
    if(validationErrors.length>0){
        return res.status(400).json({
            success:false,
            message:"validation Error",
            error:validationErrors
        })
    }
    next()
}
}
