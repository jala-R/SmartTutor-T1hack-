"use strict";
const nodemailer=require("nodemailer");

async function sendEmail({to,body:text,subject}){
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });


        let info = await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject,
            text:body,
        });
}

module.exports=sendEmail;