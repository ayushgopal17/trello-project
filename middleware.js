const jwt= require("jsonwebtoken");

function authmiddleware(req,res,next){
const token =req.headers.token;

const decode=jwt.verify(token,"Ayush123")
const userId= decode.userId;

if(userId){
    req.userId=userId;
    next();
}
else{
    res.status(403).json({
        message: "Token was incorrect"
    })
}
}
module.exports={
    authmiddleware
}