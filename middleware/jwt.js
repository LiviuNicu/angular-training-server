var JWT_KEY="PigglyWigglySecret";
var jwt=require('jsonwebtoken')

exports.getToken=(obj)=>{
    var token=jwt.sign(obj,JWT_KEY,{expiresIn:'1h'})
    return token;
}

exports.checkToken=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,JWT_KEY);
        req.userData=decoded;
        next();
    }catch (err){
        return res.status(401).json({message:'Auth failed'});
    }
}