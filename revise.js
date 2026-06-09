const express= require("express");
const jwt=require("jsonwebtoken");
const {authMiddleware} =require("./middleware");


const app=express();

app.use(express.json());

const notes=[];
const users=[];

app.post("/signup",(req,res)=>{

    const username=req.body.username;
    const password= req.body.password;
    const userExist = users.find(user=> user.username === username);

    if(userExist){
        return res.status(403).json({
            message: "user alreay exist"
        })
    }

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: " you have signup"
    })
})

app.post("/signin",(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist= users.find(user => user.username=== username && user.password === password);

    if(!userExist){
        res.status(403).json({
            message:"Incorrect crediential"
        })
        return;
    }
    const token =jwt.sign({
    username: username
    },"Ayush123")
    res.json({
        token:token
    })
})

app.post("/notes",authMiddleware,(req,res)=>{

    const username=req.username;
    const note=req.body.note;

    notes.push({
        note,username
    });
    res.json({
        message: "Done!"
    })
})

app.get("/notes",authMiddleware,(req,res)=>{
    const username=req.username;
    const userNotes =notes.filter(note =>note.username === username)
    res.json({
        notes: userNotes
    })
})


 app.get("/",(req,res)=>{
        res.sendFile("/Users/ayushgopal/Development-2k26/week-9/frontend/index.html")
    })

        app.get("/signup",(req,res)=>{
        res.sendFile("/Users/ayushgopal/Development-2k26/week-9/frontend/signup.html")
    })


        app.get("/signin",(req,res)=>{
        res.sendFile("/Users/ayushgopal/Development-2k26/week-9/frontend/signin.html")
    })

app.listen(3000)



