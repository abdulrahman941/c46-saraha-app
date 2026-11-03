import { model, Schema, Types } from "mongoose";



const messageSchema=new Schema({
    content:{
        type:String,
        min:5,
        required:function(){
        console.log({attachments:this.attachments});
            return this.attachments?.length ?false:true
        }
    },
    attachments:{
        type:[String],

    },
    receiver:{
        type:Types.ObjectId,
        ref:"usermodels",
        required:true
    }
},{
    timestamps:true,
    query:false,
    strictQuery:true
})


export const messagemodel=model("messagemodel",messageSchema)