// function authMiddleware(req,res,next){
//     const token=req.headers.token;

// if(!token) {
//     res.status(403).send({
//         message: "you are not logged in"
//     });
//     return;
// }

// const decode= jwt.verify(token,"Ayush123");
// const username= decode.username;

// if(!username){
//     res.status(403).json({
//         message: "malformed token"
//     })
//     return;
// }
// req.username =username;
// next();

// }

// module.exports = { authMiddleware }




const jwt= require('jsonwebtoken');
 
function authMiddleware(req,res,next){
const token=req.headers.token;

const decode= jwt.verify(token,"atlassiansecretpassword");
const userId=decode.userId;

 if(userId){

 
  req.userId;
  next();

}
else{
    res.status(403).json({
        message: "Token was incorrect"
    })
}}

module.exports= { authMiddleware:authMiddleware }
