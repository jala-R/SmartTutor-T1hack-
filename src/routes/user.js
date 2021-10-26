"use strict";
const express=require("express"),
    app=express.Router(),
    UserModel=require("../db/userModel"),
    sendEmail=require("../helper/sendEmail");




app.post("/signup",async (req,res)=>{
    if(!req.body.password)return res.status(400).send();
    try{
        req.body.dob=new Date(`${req.body.year}-${req.body.month}-${req.body.date} 00:00.000Z`)
        let newUser=new UserModel(req.body);

        let respUser=await newUser.save();
        res.send(respUser);
    }catch(err){
        res.status(400).send(err.message);
    }
})


module.exports=app;