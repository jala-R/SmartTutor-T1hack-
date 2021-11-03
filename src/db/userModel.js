"use strict";
const mongoose=require("mongoose"),
    bcrypt=require("bcryptjs"),
    jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLenght:[4,"min required 4 chars"],
        maxLenght:[10,"max can be 10 chars"],
        unique:true,
        immutable:true
    },
    dob:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        immutable:true
    },
    password:{
        type:String
    },
    "oauth-google":{
        type:String,
        immutable:true
    },
    "login-key":{
        type:String
    }

})


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
    }
    next();
})

const User=mongoose.model("User",userSchema);

User.prototype.generateLoginToken=async function(){
    this["login-key"]=jwt.sign({id:this._id},process.env.JWTLOGINSECRET);
    await this.save();
}

User.prototype.login=async function(password){
    let hasedPassword=this.password;
    if(!bcrypt.compareSync(password, hasedPassword))return false;
    await this.generateLoginToken();
    return true;
}

User.prototype.logout=async function(){
    this["login-key"]=undefined;
    await this.save();
}

module.exports=User;