import { Router } from "express";
import* as userservices from "./user.services.js"
import { auth } from "../../middleware/authentication.middleware.js";
import { allowedMimeType, uploadFile } from "../../utils/multer/uploadfiles.js";


const userrouter=Router()

userrouter.get("/",auth,userservices.getprofile)
userrouter.patch("/update-profile-pic",uploadFile({destination:"./user/profile",fileValidation:allowedMimeType.imageMimeTypes}).single("image"),userservices.profilePicture)




export default userrouter