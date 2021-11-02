function oauthGoogleVerification(req,res,next){
    if(!req.signedCookies)return res.status(400).send();
    if(!req.signedCookies.oagl)return res.status(400).send();
    if(!req.signedCookies.oagl.email)return res.status(400).send();
    if(!req.signedCookies.oagl.id)return res.status(400).send();
    next();
}

module.exports=oauthGoogleVerification