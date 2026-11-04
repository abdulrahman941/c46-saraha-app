import dotenv from "dotenv"
dotenv.config({path:"./config/.env"})

const databaseurl=process.env.DATABASEURL
const SECRET_KEY=process.env.SECRET_KEY
const cloud_name=process.env.cloud_name
const api_key=process.env.api_key
const api_secret=process.env.api_secret
const NODE_ENV=process.env.NODE_ENV

export const env={
databaseurl,
SECRET_KEY,
cloud_name,
api_key,
api_secret,
NODE_ENV


}