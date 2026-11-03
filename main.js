import  bootstrap  from "./src/app.controller.js"
import dotenv from "dotenv"
import express from "express"

const app=express()
const port=3000
bootstrap(app,express)



app.listen(port,()=>{
    `app is listening on port ${port}`
})