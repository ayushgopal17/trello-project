
const jwt=require("jsonwebtoken")

function authmiddleware(req,res,next){

    try{
    const token= req.headers.token;

    const decoded=jwt.verify(token,"Atlassian123")
   const userId=decoded.userId;
  
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

catch(err){
res.status(403).send({
    message: "Invalid token"
})
}
}
module.exports= {
    authmiddleware
}
