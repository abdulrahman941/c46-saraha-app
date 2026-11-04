import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/response/failed.response.js";
import { CreateSuccessResponse, successResponse } from "../../common/response/success.response.js";
import { create, createOne, find, findOne } from "../../Database/model/database.repositry.js"
import usermodel from "../../Database/model/usermodel.js"
import bcrypt, { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { createOTP } from "../../utils/otp.js";
import { redisclient } from "../../utils/Redis/Redis.connect.js";
import { forgetPasswordKey } from "../../utils/Redis/Redis.services.js";
import generateHtml from "../../utils/Email/html.templete.js";
import { sendEmail } from "../../utils/Email/sendEmail.js";
import { verifyGoogleAccount } from "../../utils/social-login/verifyGoogleAcount.js";
import { providersEnum } from "../../utils/enums/user.enum.js";



export const signup=async(req,res)=>{
    try {
    const {fName,lName,username,email,password,confirmedpassword,age,phone}=req.body
    console.log("REQ BODY RECEIVED:", req.body); // <--- أضف هذه السطر لرؤية البيانات القادمة
    if (!fName||!lName||!username || !email || !password)
      throw BadRequestException({message:"mising data failed"})
    if (password !== confirmedpassword)
      throw BadRequestException({message:"passwords do not match"})
    const existUser=await findOne({model:usermodel,filter:{email}})
    if(existUser) throw ConflictException({message:"user already exist"})
    const hashedPassword = await bcrypt.hash(password, 10)

    const user=await create({model:usermodel,data:{fName,lName,username,email,password:hashedPassword,age,phone}}) 
    return CreateSuccessResponse({res,status:201,message:"user created successfully",data:user})
    } catch (error) {
       console.log("actual error:", error);
        
        // الحل هنا: استخدم الـ status والـ message الخاصة بالخطأ الأصلي الذي قمت برميه (throw)
        const statusCode = error.cause?.status || 500;
        const errorMessage = error.message || "something went wrong";

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            extra: error.cause?.extra
        });

    }
}

export const login=async(req,res)=>{
    try {
    const {email,password}=req.body
     if (!email || !password)
      return BadRequestException({message:"email or password are required"})
    const existUser=await findOne({model:usermodel,filter:{email}})
    if(!existUser) return NotFoundException({message:"invalid email or password"})
         const match = await bcrypt.compare(password, existUser.password)
    if (!match) return UnauthorizedException({message:"invalid email or password"})

    const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
    return successResponse({res,status:200,message:"user login successfully",data:token})
    } catch (error) {
        return BadRequestException({message:"invalid credentials"})
    }
}

export const forgetpassword=async(req,res)=>{
   try {
     const {email}=req.body
    const user=await findOne({model:usermodel,filter:{email}})
    if(!user){
       throw NotFoundException("user not found")
    }
    const SaveOtp=await redisclient.get(forgetPasswordKey(user._id))
    if(SaveOtp){
        const ttl=await redisclient.ttl(forgetPasswordKey(user._id))
        throw  BadRequestException(`wait ${ttl} seconds to resend otp`)
    }
    const otp=String(createOTP())
    console.log("otp",otp);
    
    await redisclient.set(forgetPasswordKey(user._id),otp,{
        expiration:{
            type:"EX",
            value:10*60
        }
    }) 

    sendEmail({
        to:email,
        subject:"Forget Password",
        html:generateHtml(otp)
    })
return successResponse({
    res,
    message:"Done"
})
   } catch (error) {
     console.log("actual error:", error);
        
        // الحل هنا: استخدم الـ status والـ message الخاصة بالخطأ الأصلي الذي قمت برميه (throw)
        const statusCode = error.cause?.status || 500;
        const errorMessage = error.message || "something went wrong";

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            extra: error.cause?.extra
        });

   }
}

export const Resetpassword=async(req,res)=>{
   try {
    const {otp,password,email}=req.body
   const user=await findOne({model:usermodel,filter:{email}})
    if(!user){
       throw NotFoundException("user not found")
    }
    const SaveOtp=await redisclient.get(forgetPasswordKey(user._id))
    if(!SaveOtp){
        throw BadRequestException("send otp first")
    }
    if(SaveOtp!=otp){
        BadRequestException("invalid otp")
    }
    user.password=await hash(password,10)
    await user.save()
    return successResponse({
        res,
        message:"user Reset successfully"
    })
   } catch (error) {
    console.log("actual error:", error);
        
        // الحل هنا: استخدم الـ status والـ message الخاصة بالخطأ الأصلي الذي قمت برميه (throw)
        const statusCode = error.cause?.status || 500;
        const errorMessage = error.message || "something went wrong";

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            extra: error.cause?.extra
        });
   }

}

export const updatepassword=async(req,res)=>{
try {
  const user=req.user
const{oldpassword,newpassword}=req.body
if(!await compare(oldpassword,user.password)){
throw BadRequestException("in-valid old password")
}
user.password=await hash(newpassword,10)
await user.save()
return successResponse({
    res,
    message:"user update password successfully"
})
} catch (error) {
  console.log("actual error:", error);
        
        // الحل هنا: استخدم الـ status والـ message الخاصة بالخطأ الأصلي الذي قمت برميه (throw)
        const statusCode = error.cause?.status || 500;
        const errorMessage = error.message || "something went wrong";

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            extra: error.cause?.extra
        });
}
}

export const loginwithgoogle = async (req, res, next) => {
  try {
    const idToken = req.body.idToken || req.body.idtoken || req.body.id_token;

    if (!idToken) {
      return next(BadRequestException("idToken is required"));
    }

    // 1. التحقق من التوكن وجلب الـ payload
    const payload = await verifyGoogleAccount(idToken);
    console.log("Google Payload:", payload);

    if (!payload) {
      return next(BadRequestException("Invalid Google Token"));
    }

    const { email, email_verified, given_name, family_name, picture, name } = payload;

    // 2. التحقق من أن الإيميل مفعل من جوجل
    if (!email_verified) {
      return next(BadRequestException("email not verified"));
    }

    // 3. البحث عن المستخدم في الداتابيز
    let user = await findOne({ model: usermodel, filter: { email } });

    if (user) {
      // لو اليوزر مسجل من قبل بس مش جوجل (مثلاً مسجل بـ Email & Password عادي)
      if (user.provider !== providersEnum.GOOGLE) {
        return next(ConflictException("email already registered with another provider"));
      }
    } else {
      // لو اليوزر مش موجود، نعمله إنشاء جديد (Signup)
      const result = await createOne({
        model: usermodel,
        data: [
          {
            name: name || `${given_name || ""} ${family_name || ""}`.trim(),
            email,
            provider: providersEnum.GOOGLE,
            // ممكن تحط حاجات افتراضية لو الموديل بيطلبها زي password وهمي أو phone لو مش إلزامي
          },
        ],
      });
      user = Array.isArray(result) ? result[0] : result;
    }

    // 4. عمل توكن (JWT) للمستخدم (سواء كان قديم أو جديد)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    // 5. تجهيز بيانات اليوزر للإرسال بدون الحاجة لبيانات حساسة
    const userData = user.toObject ? user.toObject() : user;
    if (userData.password) delete userData.password;

    return successResponse({
      res,
      statusCode: 200,
      message: "user logged in successfully with google",
      data: { token, user: userData },
    });

  } catch (error) {
    return next(error);
  }
};