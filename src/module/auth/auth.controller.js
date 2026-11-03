import { Router } from "express";
import* as authservices from "./auth.services.js"
import { loginschema, signupschema } from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { auth } from "../../middleware/authentication.middleware.js";


const authrouter=Router()



authrouter.post("/signup",validation(signupschema),authservices.signup)
authrouter.post("/login",validation(loginschema),authservices.login)
authrouter.post("/forget-password",authservices.forgetpassword)
authrouter.patch("/Reset-password",authservices.Resetpassword)
authrouter.patch("/update-password",auth,authservices.updatepassword)
authrouter.post("/social-login",authservices.loginwithgoogle)


authrouter.get("/",(req,res)=>{
    return res.status(200).json({message:"welcome to auth router"})
})


export default authrouter