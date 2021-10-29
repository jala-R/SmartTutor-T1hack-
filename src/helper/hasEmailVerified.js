function hasEmailVerifed(req,res,next){
    if(!req.signedCookies)return res.status(400).send();
    if(!req.signedCookies.esig)return res.status(400).send();
    if(!req.signedCookies.esig.email)return res.status(400).send();
    next();
}


module.exports=hasEmailVerifed;