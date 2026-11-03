import { NotFoundException } from "../../common/response/failed.response.js";
import { successResponse } from "../../common/response/success.response.js";




export const getprofile = async (req, res, next) => {
return successResponse({
  res,
  message:"Done",
  data:{
    user:req.user
  }
})  
next()
};

export const profilePicture=async(req,res)=>{
res.json({
  file:req.file,
  files:req.files,
  body:req.body
})
}