import { createClient } from "redis";

export const redisclient=new createClient(
    {
        url:"redis://127.0.0.1:6379",
        RESP:2
    }
)
redisclient.on("err",(err)=>{
    console.log("redis connection failed");
    
})