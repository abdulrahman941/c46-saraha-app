import { NotFoundException, UnauthorizedException } from "../../common/response/failed.response.js"
import { create, deleteOne, find, findById } from "../../Database/model/database.repositry.js"
import usermodel from "../../Database/model/usermodel.js"
import { messagemodel } from "../../Database/model/messagemodel.js"
import { successResponse } from "../../common/response/success.response.js"


//1-data=>{content,attachment}
//2-check receiver
//3-create message
//4-return res


export const sendmessage=async(req,res)=>{
const{content,sendTo}=req.body
const{files}=req
console.log({files});

const receiver=await findById({model:usermodel,id:sendTo})
if(!receiver){
    throw NotFoundException("In-Valid reciver id")
}
let attachments=[]
if(req.files?.length){
    attachments=req.files.map((ele)=>ele.path)
}
const message=await create({model:messagemodel,data:{content,attachments,receiver:receiver._id}})
successResponse({
    res,
    data:message
})
}

export const getMessages=async(req,res)=>{
const user=req.user
const messages=await find({model:messagemodel,select:{receiver:user._id}})

successResponse({
    res,
    data:messages
})
}

export const deleteMessage=async(req,res)=>{
    const user=req.user
    const{id}=req.params
    const message=await findById({model:messagemodel,_id:id})
    if(!message){
        throw NotFoundException("message not found")
    }
    //عشان {}=={}=false
    //إنما "{}"=="{}"=true
    if(message.receiver.toString()==user._id.toString()){
        throw UnauthorizedException("not authorized to delete this message")
    }
    await deleteOne({model:messagemodel,filter:{_id:id}})
    return successResponse({
        res,
        message:"message deleted successfully"
    })
}