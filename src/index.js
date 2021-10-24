"use strict";
const express=require("express"),
    app=express(),
    PORT=process.env.PORT||3000,
    userRouter=require("./routes/user");
require("./db/connect");

//configs
app.use(express.json());
app.use(express.urlencoded({extended:false}));



//router merge
app.use(userRouter);




app.get("*",(req,res)=>{
    res.status(404).send("Not Found !!");
})


app.listen(PORT,()=>{
    console.log("server running!");
})