const express=require("express"),
    app=express.Router(),
    UserModel=require("../db/userModel"),
    sendEmail=require("../helper/sendEmail");




module.exports=app;