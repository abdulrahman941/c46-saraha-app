import mongoose, {Schema} from "mongoose"
import { GenderEnum, providersEnum, RoleEnum } from "../../utils/enums/user.enum.js";


const userSchema=new Schema({
fName:{
    type:String,
    // required:true,
    trim:true
},
lName:{
    type:String,
    // required:true,
    trim:true


},
age:{
    type:Number,
    // required:true

},
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    index:true


},
password:{
    type:String,
    // required:true

},
confirmedpassword:{
    type:String,
},
emailConfirmed:{
type:Boolean,
default:false
},
gender:{
    type:String,
    enum:Object.values(GenderEnum),
    default:GenderEnum.MALE
},
role:{
    type:String,
    enum:Object.values(RoleEnum),
    default:RoleEnum.USER
},
phone:{
    type:String,
},
provider:{
    type:Number,
    default:providersEnum.SYSTEM,
    enum:Object.values(providersEnum)
},
address:{
    city:{
        type:String,
        // required:true

    },
    street:{
        type:String,
        // required:true

    },
    country:{
        type:String,
        // required:true

    }
},
profilepic:{
    type:String,
},
coverpics:{
    type:[String],
},
skills:[{
    type:String,
}],
is_deleted:{
    type:Boolean,
    default:false
},
otp:{
    type:String,
    default:null,

},
otpExpire:{
    type:Date,
    default:null
}
},{
timestamps:true,
strict:true,
strictQuery:true,
optimisticConcurrency:true


})
userSchema.virtual("username").get(function () {
    return `${this.fName} ${this.lName}`;
});

// userSchema.virtual("username").set(function(value){
//     const[fName,lName]=value.split(" ")
//     ((this.fName=fName),(this.lName=lName))
// }).get(function(value){
//     return this.fName + " " + this.lName
// })

const usermodel=mongoose.model("usermodel",userSchema)


export default usermodel

