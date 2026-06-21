const express= require("express");
const jwt= require("jsonwebtoken");
const {authmiddleware}= require("./middleware")
const {usersModel,organisationModel} = require("./models");

let BOARDS_ID=1;
let ISSUES_ID=1;



const BOARDS=[];
const ISSUES=[];

const app=express();
app.use(express.json())

app.post("/signup",async(req,res)=>{
const username= req.body.username;
const password=req.body.password;

//const userExist= USERS.find(u => u.username ===username);
const userExist= await usersModel.findOne({
    username:username
})
if(userExist) {
    res.status(411).json({
        message: "user with this username already exist"
    })
    return
}
// USERS.push({
//     username,
//     password,
//     id: USERS_ID++
// })

const newUser= usersModel.create({
    username: username,
    password:password
})
res.json({
    id: newUser._id,
    message: "You have signup successfully"
})

})

app.post("/signin",async(req,res)=>{

    const username= req.body.username;
    const password = req.body.password;

    //const userExist= USERS.find( u=> u.username === username && u.password === password)
    const userExist= await usersModel.findOne({
username: username,
password:password
    });
    if(!userExist){
        res.status(403).json({
            message: "Incorrect credientials"
        })
        return
    }

   const token= jwt.sign({
        userId: userExist.id
    },"Atlassian123");
    res.json({
        token
    });
})
app.post("/organizations",authmiddleware,(req,res)=>{
const userId=req.userId;

const newOrg = await organisationModel.create({


    title: req.body.title,
    description: req.body.description,
    admin: userId,
    member: []
})

res.json({
    message: "Org created",
    id: ORGANISATIONS_ID -1
})
})

app.post("/add-member-to-organization",authmiddleware,async (req,res)=>{
    const userId=req.userId;
    const organisationId=req.body.organisationId;
    const memberUserUsername= req.body.memberUserUsername;

    const organisation= await organisationModel.findOne({
        _id:organisationId
    })

    if(!organisation || organisation.admin !== userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not an admin"
        })
        return
    }

    const memberUser= USERS.find(u => u.username ===memberUserUsername);

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }



    organisation.member.push(memberUser.id);
    res.json({
        message: "new member added"
    })

})

app.post("/board",(req,res)=>{

})

app.post("/issue",(req,res)=>{

})

app.get("/boards",(req,res)=>{

})
app.get("/organisation",authmiddleware,(req,res)=>{
const userId =req.userId;
const organisationId= parseInt(req.query.organisationId);



    const organisation=ORGANISATIONS.find(org => org.id=== organisationId);

    if(!organisation || organisation.admin !== userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not an admin"
        })
        return
    }

    res.json({
        organisation: organisation
    })

})
app.get("/issues",(req,res)=>{
    
})

app.get("/member",(req,res)=>{
    
})

app.put("/issues",(req,res)=>{

})

app.delete("/members",authmiddleware,(req,res)=>{
const userId=req.userId;
    const organisationId=req.body.organisationId;
    const memberUserUsername= req.body.memberUserUsername;

    const organisation=ORGANISATIONS.find(org => org.id=== organisationId);

    if(!organisation || organisation.admin !== userId){
        res.status(411).json({
            message: "Either org doesnt exist or you are not an admin"
        })
        return
    }

    const memberUser= USERS.find(u => u.username ===memberUserUsername);

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }

organisation.member= organisation.member.filter(id => id !== memberUser.id);


    res.json({
        message: "member removed"
    })


})

app.listen(3000);