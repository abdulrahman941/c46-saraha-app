import jwt from "jsonwebtoken"


export const generatetoken=(payload,SECRET_KEY,option={})=>{
const token=jwt.sign(payload,SECRET_KEY,option)
return token
}
export const verifytoken=(token,SECRET_KEY,option={})=>{
const payload=jwt.verify(token,SECRET_KEY,option)
return payload
}