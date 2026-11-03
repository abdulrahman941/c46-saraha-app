import nodemailer from "nodemailer"

export const sendEmail=async({to,subject,html}={})=>{
const transporter=nodemailer.createTransport({
host:"",
port:151,
service:"gmail",
auth:{
    user:"abdulrahman.1999hemida@gmail.com",
    pass:"afqk zwar taxy sldz"
}
})

const info=await transporter.sendMail({
    from:"Hamada <abdulrahman.1999hemida@gmail.com>",
    to,
    subject,
    html
})
console.log(info.accepted);

}