import dotenv from "dotenv"
dotenv.config({path:"./config/.env"})

const databaseurl=process.env.DATABASEURL
const SECRET_KEY=process.env.SECRET_KEY


export const env={
databaseurl,
SECRET_KEY


}