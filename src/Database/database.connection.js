import mongoose from "mongoose"
import {env} from "../../config/evv.services.js"




export const databaseConnection=()=>{
 mongoose.connect(env.databaseurl).then(()=>{
  console.log("database connected");
  
 }).catch((error)=>{
  console.error(error);

 })
}
