import cloudinary from "./cloudinary.config.js"

export const uploadToCloudinary = (file, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // يشتغل مع صور، فيديو، PDF
        public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    stream.end(file.buffer)
  })
}

export const deleteFromCloudinary = (public_id, resource_type = "image") =>
  cloudinary.uploader.destroy(public_id, { resource_type })