import joi from "joi"

export const signupschema=joi.object({
    fName:joi.string().min(3).max(30).required(),
    lName:joi.string().min(3).max(30).required(),
    username:joi.string().min(5).max(30).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required(),
    confirmedpassword:joi.string().valid(joi.ref("password")).min(6).required(),
    age:joi.number().required(),
    phone:joi.string().min(10).max(11).required()
})

export const loginschema={
    body:joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(6).required()
    })
}