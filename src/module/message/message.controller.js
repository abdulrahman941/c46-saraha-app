import { Router } from "express";
import* as messageservices from "./message.services.js"
import { allowedMimeType, uploadFile } from "../../utils/multer/uploadfiles.js";
import { auth } from "../../middleware/authentication.middleware.js";

const messagerouter=Router()


messagerouter.post("/",uploadFile({destination:"messagemodels",fileSize:100*1024,fileValidation:allowedMimeType.imageMimeTypes}).array("images",5),messageservices.sendmessage)
messagerouter.get("/",auth,messageservices.getMessages)
messagerouter.delete("/:id",auth,messageservices.deleteMessage)



export default messagerouter