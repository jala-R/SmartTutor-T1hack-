const mongoose=require("mongoose"),
    bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLenght:[4,"min required 4 chars"],
        maxLenght:[10,"max can be 10 chars"],
        unique:true
    },
    dob:{
        type:Date,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    gmailLink:{
        type:String,
        sparse:true
    }

})


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
    }
    next();
})



const User=mongoose.model("User",userSchema);

module.exports=User;