const express= require("express")
const jwt= require("jsonwebtoken")
const {authmiddleware}= require("./middleware");

const app=express();

app.use(express.json());
let USERS_ID=1;
let ORGANISATIONS_ID=1;
let BOARDS_ID=1;
let ISSUES_ID=1;


const USERS=[];
const ORGANISATIONS=[];
const BOARDS=[];
const ISSUES=[];

// Name of project WorkSync 

// create 
app.post("/signup",(req,res)=>{
    const username=req.body.username;
    const password= req.body.password;

    const userExist= USERS.find(u=> u.username === username);

    if(userExist){
        res.status(403).json({
            message: "User with this Username already exist"
        })
        return
    }

  USERS.push({
        username: username,
        password: password,
        id: USERS_ID++
    })
    res.json({
        message : "you have successfully signed up"
    })
    
})


app.post("/signin",(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist= USERS.find(u=> u.username === username && u.password === password)

    if(!userExist){
        res.status(403).json({
            message: "Incorrect credientials"
        })
        return
    }
 
    const token= jwt.sign({
        userId: userExist.id

    },"Ayush123");
    
res.json({
    token
})
})

app.post("/organization",authmiddleware,(req,res)=>{

     const userId= req.userId;

     ORGANISATIONS.push({
        id: ORGANISATIONS_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members:[]
     })
     res.json({
        message: "org created",
        id: ORGANISATIONS_ID-1
     })
})

app.post("/add-member-to-organisation",authmiddleware,(req,res)=>{
    const userId= req.userId;
     const organisationId=req.body.organisationId;
     const memberUserUsername= req.body.memberUserUsername;

     const organisation= ORGANISATIONS.find(org=> org.id=== organisationId);
     if(!organisation || organisation.admin != userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }

     const memberUser= USERS.find(u=> u.username=== memberUserUsername);

     if(!memberUser){
        res.status(403).json({
            message: "No user with this username in our db"
        })
        return
     }
     organisation.members.push(memberUser.id);
     res.json({
        message: "New member added"
     })

})

app.post("/board",authmiddleware,(req,res)=>{
    const userId=req.userId;
    const organisationId=req.body.organisationId;
    const title=req.body.title;
 
    const organisation= ORGANISATIONS.find( org=> org.id=== organisationId);

    if(!organisation || organisation.admin !=userId){
        res.json({
            message: "either wrong organisation or you are not an admin"
        })
        return
    }
    BOARDS.push({
        id:BOARDS_ID++,
        title: title,
        organisationId: organisationId
    });
    res.json({
        message: "Board created",
        id: BOARDS_ID-1
    })
})

app.post("/issues",authmiddleware,(req,res)=>{

const boardId=req.body.boardId;
const title=req.body.title;
const description=req.body.description;
const status=req.body.status;

const board= BOARDS.find(board=> board.id ===boardId);

if(!board ){
    res.status(403).json({
        message: " your board does not exist"
    })
    return
}
ISSUES.push({
    id: ISSUES_ID++,
    title,
    description,
    status,
    boardId

})
res.json({
    message: "Issue created",
    id: ISSUES_ID-1
})

})

app.get("/organization",authmiddleware,(req,res)=>{
    const userId=req.userId;
   const organisationId = Number(req.query.organisationId);

    const organisation= ORGANISATIONS.find(org=> org.id === organisationId);
     if(!organisation || organisation.admin != userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }
     res.json({
        organisation:{
            ...organisation,
            members: organisation.members.map(memberId =>{
                const user= USERS.find(user=> user.id === memberId);
                return{
                    id: user.id,
                    username: user.username
                }
            })
        }
     })
})


app.get("/boards",authmiddleware,(req,res)=>{

    const userId=req.userId;
    const organisationId=Number(req.query.organisationId);
    const organisation= ORGANISATIONS.find(
        org=> org.id === organisationId);
    if(!organisation || organisation.admin != userId){
        res.status(403).json({
            message: "Either organisation does not exist or you are not an admin"
        })
    }
    const board= BOARDS.filter(
        board=> board.organisationId=== organisationId
    );
    res.json({
        board
    })

})

app.get("/issues",authmiddleware,(req,res)=>{

    const boardId=Number(req.query.boardId);
    const board= BOARDS.find(board=> board.id== boardId)
    if(!board ){
        res.status(403).json({
            message: "Board not found"
        })
        return
    }
    const issues=ISSUES.filter(
        issue=> issue.boardId=== boardId
    )
    
    res.json({
        issues
    })
})

app.get("/members",authmiddleware,(req,res)=>{
const userId=req.userId;
const organisationId= Number(req.query.organisationId)

const organisation= ORGANISATIONS.find(
    org=> org.id ===organisationId
);

if(!organisation){
    res.status(403).json({
        message: "organisation not found"
    });
}

const member=organisation.members.map(memberId=>{
    const user= USERS.find(
        user=> user.id===memberId
    );
    return{
        id: user.id,
        username: user.username
    }
})

 res.json({
    member
})
})

// Update
app.put("/issues",authmiddleware,(req,res)=>{

    const issueId=req.body.issueId;
    const status=req.body.status;

    const issue= ISSUES.find(
        issue=> issue.id=== issueId
    );

    if(!issue){
        return res.status(403).json({
            message: "issue not found"
        });
    }
    issue.status=status;
    res.json({
        message:"Issue updated"
    })
})

app.delete("/members",authmiddleware,(req,res)=>{
const userId= req.userId;
     const organisationId=req.body.organisationId;
     const memberUserUsername= req.body.memberUserUsername;

     const organisation= ORGANISATIONS.find(org=> org.id=== organisationId);
     if(!organisation || organisation.admin != userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }

     const memberUser= USERS.find(u=> u.username=== memberUserUsername);

     if(!memberUser){
        res.status(403).json({
            message: "No user with this username in our db"
        })
        return
     }
     organisation.members= organisation.members.filter(id => id !== memberUser.id);
     res.json({
        message: "member deleted"
     })
})

app.listen(3000);