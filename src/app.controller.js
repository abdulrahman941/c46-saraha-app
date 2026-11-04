import helmet from "helmet"
import cors from "cors"
import { BadRequestException, globalhandlingerror } from "./common/response/failed.response.js"
import { databaseConnection } from "./Database/database.connection.js"
import authrouter from "./module/auth/auth.controller.js"
import messagerouter from "./module/message/message.controller.js"
import userrouter from "./module/user/user.controller.js"
import { redisclient } from "./utils/Redis/Redis.connect.js"
import rateLimit, { ipKeyGenerator } from "express-rate-limit"
import { auth } from "./middleware/authentication.middleware.js"
import RedisStore from "rate-limit-redis"


 const bootstrap=async(app,express)=>{
    await databaseConnection()
    try {
        await redisclient.connect();
        console.log("Redis connected successfully");
    } catch (err) {
        console.log("redis connection failed =>", err.message);
    }
   
    // app.use((req,res,next)=>{
    //     console.log(req.method);
    //     const origin=req.headers.origin         
    //     const whiteList=[
    //     "http://localhost:5500"
    // ]
    // if(!whiteList.includes(origin)){
    //  throw BadRequestException("origin not allowed")
    // }
    //     res.header("Access-Control-Allow-Origin","origin")
    //     res.header("Access-Control-Allow-Methods","")

    //     next()
    // })

    app.use(cors())
    app.use(helmet({
        contentSecurityPolicy:true,

    }))
    app.use(rateLimit({
        windowMs:20*1000,
        limit:5,
        keyGenerator:(req,res)=>{
            return ipKeyGenerator(req)
        }
        // keyGenerator:(req)=>{
        // const key=req.user?req.user._id.toString():req.ip
        // console.log({key});
        // return key
        
        // },
        // store:new RedisStore({
        //     sendCommand:(...args)=>redisclient.sendCommand(args)
        // }),
        // handler:(req,res)=>{
        //     res.status(429).json({message:"wait a few second"})
        // }

    }))
    app.use(express.json())
    app.get("/",(req,res,next)=>{
        res.status(200).json({message:"hello abdulrahman welcome from new server"})
        next()
    })

     app.use("/api/v1/auth",authrouter)
     app.use("/api/v1/message",messagerouter)
     app.use("/api/v1/user",userrouter)  

     app.all("/*dummy",(req,res)=>{
        return res.status(404).json({message:"not found handller!!"})
    })
   
    app.use(globalhandlingerror)
}


export default bootstrap