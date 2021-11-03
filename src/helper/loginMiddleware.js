const jwt=require("jsonwebtoken"),
    UserModel=require("../db/userModel");
async function loginMiddleware(req,res,next){
    try{
        let {token}=req.signedCookies.login;
        let decodedValue=jwt.verify(token,process.env.JWTLOGINSECRET);
        let userId=decodedValue.id;
        let user=await UserModel.findById(userId);
        if(user==null||user["login-key"]!=token)throw new Error();
        req.user=user;
        next();
    }catch(err){
        res.send("not logged in");
    }
}

module.exports=loginMiddleware;