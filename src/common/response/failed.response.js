import { env } from "../../../config/evv.services.js"

export const ErrorResponse=({
    status=400,
    message="something went wrong",
    extra=undefined

}={})=>{
    throw new Error(message,{cause:{status,extra}})
}
export const BadRequestException=({message="Bad Request",extra=undefined}={})=>{
      return ErrorResponse({status:400,message:message,extra:extra})
}

export const NotFoundException=({message="Not Found Error",extra=undefined}={})=>{
      return ErrorResponse({status:404,message:message,extra:extra})
}
export const ConflictException=({message="Conflict Error",extra=undefined}={})=>{
      return ErrorResponse({status:409,message:message,extra:extra})
}
export const UnauthorizedException=({message="Unauthorized Error",extra=undefined}={})=>{
      return ErrorResponse({status:401,message:message,extra:extra})
}
export const ForbiddenException=({message="Forbidden Error",extra=undefined}={})=>{
      return ErrorResponse({status:403,message:message,extra:extra})
}
export const InternalServerErrorException = ({message="Internal Server Error",extra=undefined}={})=>{   
      return ErrorResponse({status:500,message:message,extra:extra})
      }   

      
export const globalhandlingerror = (err, req, res, next) => {
    // 1. طباعة الخطأ في الـ Console للـ Debugging
    console.log("Error Stack:", err.stack);
    console.log("Error Cause:", err.cause);

    // 2. تحديد بيئة العمل (تأكد من استخدام process.env.NODE_ENV)
    const currentMode = process.env.NODE_ENV || "dev";
    const isDev = currentMode === "dev" || currentMode === "development";

    // 3. استخراج الـ Status بمرونة فائقة من كل الأماكن المحتملة
    const statusCode = err.status || err.statusCode || err.cause?.status || 500;

    // 4. تحديد الرسالة والـ Stack بناءً على البيئة
    const errorMessage = err.message || "something went wrong";
    
    return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        // إظهار الـ extra لو وُجدت داخل الـ cause
        extra: err.cause?.extra || null, 
        // الـ stack تظهر فقط في وضع الـ dev لتجنب تسريب معلومات الحماية في الإنتاج
        stack: isDev ? err.stack : undefined 
    });
};







// export const globalhandlingerror=(err,req,res,next)=>{
//     console.log(err.stack,"from error stack");
//     const mood=env.mood=="dev"
//     console.log(mood);
//     const status=err.status ?err.status:err.cause?err.cause.status:500
//     const defaultMessage="something went wrong"
//     const displayErrorMessage=err.message||defaultMessage
    
//    console.log(err.cause,"from test status");
//    return res.status(status).json({
//     stack:mood?err.stack:null,
//     message:mood?displayErrorMessage:defaultMessage
// })
// }