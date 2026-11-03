import { NotFoundException } from "../common/response/failed.response.js"
import { findById } from "../Database/model/database.repositry.js"
import usermodel from "../Database/model/usermodel.js"
import { verifytoken } from "../utils/token/token.js"


export const auth =async(req,res,next)=>{
  const token=req.headers.authorization
  const payload=verifytoken(token,process.env.SECRET_KEY)
  const userId=payload._id
  const user= await findById({model:usermodel,userId})
  if(!user){
    return NotFoundException("user not found")
  }
  req.user=user
  next()
}