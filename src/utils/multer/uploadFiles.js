import multer, { diskStorage } from "multer"
import fs from "fs/promises"




export const allowedMimeType={
imageMimeTypes: [
  "image/jpg",
  "image/jpeg",       // JPEG images
  "image/png",        // PNG images
  "image/gif",        // GIF images
  "image/webp",       // WebP images
  "image/svg+xml",    // SVG vector images
  "image/bmp",        // Bitmap images
  "image/tiff",       // TIFF images
  "image/x-icon",     // ICO icons
  "image/heif",       // HEIF/HEIC images
  "image/avif"        // AVIF images
],
 extendedPdfMimeTypes : [
  "application/pdf",                 
  "application/x-pdf",
  "application/acrobat",
  "application/vnd.pdf",
  "text/pdf",
],
 videoMimeType:[
"video/mp4",
"video/webm",
"video/ogg",
"video/3gpp",
"video/x-msvideo",
"video/mpeg",
"video/mp4v-es",
"video/h264",
"video/h265",
"video/avi",
"video/quicktime",
"video/matroska",
"video/jpeg",
"video/VP8",
"video/VP9",
"video/vnd.mpegurl",
"video/vivo",
"video/x-sgi-movie",
"video/x-mpeg"
]

}


export const uploadFile=({
    destination="general",
    fileSize=100*1024,
    fileValidation=allowedMimeType.imageMimeTypes
})=>{
const storage=diskStorage({
    destination:async(req,file,cb)=>{
        const folderName="./uploads/"+`${file.originalname[0]}`
       console.log({file});
       
        try {
         await fs.access(folderName)
        console.log("exists");
        
        
       } catch (error) {
        console.log("folder not exists");
        
        await fs.mkdir(folderName,{
            recursive:true
        })        
       }
    cb(null,folderName)
    },
    filename:(req,file,cb)=>{
    console.log({file});
   
   return cb(null,`${Date.now}_${file.originalname}`)

    }
})




    return multer({
        storage,
        limits:{
            fileSize,
        },
        fileFilter:(req,file,cb)=>{
            if(!fileValidation.includes(file.mimetype)){
                cb(new Error("not allowed file",false))
            }else{
                cb(null,true)
            }
        }
    })
}