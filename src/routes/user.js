"use strict";
const express=require("express"),
    app=express.Router(),
    UserModel=require("../db/userModel"),
    sendEmail=require("../helper/sendEmail"),
    jwt=require("jsonwebtoken"),
    hasEmailVerifed=require("../helper/hasEmailVerified");


app.post("/signup/email",async (req,res)=>{
    try{
        let email=req.body.email;
        let token=jwt.sign({email},process.env.JWTEMAILSECRET,{expiresIn:"3h"});
        let url=`${req.protocol}://${req.headers.host}/email-verifiaction/${token}`;
        await sendEmail({
            to:email,
            body:url,
            subject:"emailverification"
        });
        res.send("email sent");
    }catch(err){
        res.status(400).send(err.message);
    }
})

app.post("/signup",hasEmailVerifed,async (req,res)=>{
    if(!req.body.password)return res.status(400).send();
    try{
        req.body.email=req.signedCookies.esig.email;
        req.body.dob=new Date(`${req.body.year}-${req.body.month}-${req.body.date} 00:00.000Z`)
        let newUser=new UserModel(req.body);
        let respUser=await newUser.save();
        res.send(respUser);
    }catch(err){
        res.status(400).send(err.message);
    }
})
app.get("/email-verifiaction/:token",async (req,res)=>{
    try{
        let token=req.params.token;
        let decodedValue=jwt.verify(token,process.env.JWTEMAILSECRET);
        res.cookie("esig",{email:decodedValue.email},{
            httpOnly:true,
            maxAge:1000*10*60*60,
            path:"/signup",
            signed:true
        });
        res.send();

    }catch(err){
        res.status(400).send();
    }
})


module.exports=app;