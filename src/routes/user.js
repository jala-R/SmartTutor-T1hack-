"use strict";
const express=require("express"),
    app=express.Router(),
    UserModel=require("../db/userModel"),
    sendEmail=require("../helper/sendEmail"),
    jwt=require("jsonwebtoken"),
    hasEmailVerifed=require("../helper/hasEmailVerified"),
    axios=require("axios"),
    oauthGoogleVerification=require("../helper/oauthGoogleVerification");



//=====SIGINUP-PASSWORD=========================================    
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
        res.clearCookie("esig",{path:"/signup"});
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

//=============SIGINUP-OAUTH=============================


//==========GOOGLE====================

app.get("/signup-oauth-google",(req,res)=>{
    let url=`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLECLIENTID}&scope=openid%20email%20profile&redirect_uri=${req.protocol}%3A//${req.headers.host}/signup-oath-google-callback&state=aroundTrip`
    res.send(`<a href=${url}>google sigin</a>`);
})

app.get("/signup-oath-google-callback",(req,res)=>{
    axios({
        url:"https://oauth2.googleapis.com/token",
        method:"post",
        data:`code=${req.query.code}&client_id=${process.env.GOOGLECLIENTID}&client_secret=${process.env.GOOGLECLIENTSECRET}&redirect_uri=${req.protocol}%3A//${req.headers.host}/signup-oath-google-callback&grant_type=authorization_code`,
  
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(({data})=>{
        return axios({
            url:"https://www.googleapis.com/oauth2/v2/userinfo",
            method:"get",
            headers:{
                Authorization:`Bearer ${data.access_token}`
            }
        })
    })
    .then(({data})=>{
        res.cookie("oagl",{id:data.id,email:data.email},{
            httpOnly:true,
            maxAge:1000*10*60*60,
            signed:true,
            path:"/signup-oath-google"
        });
        res.send(
            `<form action="/signup-oath-google" method="post">
            <label for="fname">username</label><br>
            <input type="text" id="fname" name="username"><br><br>
            <label for="date">date</label><br>
            <input type="text" id="date" name="date"><br><br>
            <label for="month">month</label><br>
            <input type="text" id="month" name="month"><br><br>
            <label for="year">year</label><br>
            <input type="text" id="year" name="year"><br><br>
            <input type="submit" value="Submit">
          </form>`
        );
    })
    .catch((err)=>{
        res.send(err.message);
    })
})

app.post("/signup-oath-google",oauthGoogleVerification,async (req,res)=>{
    try{
        req.body.email=req.signedCookies.oagl.email;
        req.body["oauth-google"]=req.signedCookies.oagl.id;
        req.body.dob=new Date(`${req.body.year}-${req.body.month}-${req.body.date} 00:00.000Z`);
        let newUser=new UserModel(req.body);
        newUser=await newUser.save();
        res.send(newUser);
    }catch(err){
        res.status(400).send(err.message);
    }
})
app.get("/temp",(req,res)=>{
    console.log(req.signedCookies);
})
module.exports=app;