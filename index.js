const express=require ("express");
const jwt =require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

let USERS_ID =1;
let ORGANIZATIONS_ID=1;
let BOARDS_ID=1;
let ISSUES_ID=1;

const USERS=[];
const ORGANIZATIONS=[{
    id:1,
    title: "100xdevs",
    description: "Learning coding platform",
    admin: 1,
    member: [2]
}];
const BOARDS=[{
    id:1,
    title: "100xschool website (frontend)",
    organisationId:1
}];

const ISSUES=[{
    id:1,
    title: "Add dark mode",
    boardId: 1,
    state: "IN_PROGRESS"
}];

const app= express()

app.use(express.json());
app.post('/signup',(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist= USERS.find(u=> u.username === username);
    if(userExist){
        res.status(411).json({
            message: "User With this Username Already Exists"
        })
        return;
    }
    USERS.push({
        username,
        password,
        id: USERS_ID++
    })
    res.json({
        message: "you have signed up successfully"
    })
})




app.post('/signin',(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist=USERS.find(u=> u.username === username && u.password === password);
    if(!userExist) {
       return res.status(403).json({
            message: "Invalid credientials"
        })

    }

  const token =  jwt.sign({
        userId: userExist.id
    },"atlassiansecretpassword")

      res.json({
            token
        })
})

app.post('/organizations',authMiddleware,(req,res)=>{
  const user=req.userId;

  ORGANIZATIONS.push({
    id:ORGANIZATIONS_ID++,
    title: req.body.title,
    description: req.body.description,
    admin: user,
    member: []
  })
  res.json({
   message: "Org's Created",
   id: ORGANIZATIONS_ID-1
  })
})

app.post('/add-member-to-org',authMiddleware,(req,res)=>{

    const userId=req.userId;
    const organisationId= req.body.organisationId;
    const memberUserUsername= req.body.memberUserUsername;

    const organisation =ORGANIZATIONS.find(org => org.id=== organisationId);


   if(!organisation || organisation.admin !=userId) {
    res.status(411).json({
        message: "Incorrect Org's or You are not Admin of the org"
    })
    return
   }

   const memberUser = USERS.find(u => u.username === memberUserUsername);
  if(!memberUser){
     res.status(411).json({
        message: "No user with this username Exist in our Db"
    })
    return
  }


   organisation.member.push(memberUser.id);

  res.json({
    message: "new member added!"
  })

})

app.post('/board',(req,res)=>{

})

app.post('/issue',(req,res)=>{

})

app.get('/organisations',authMiddleware,(req,res)=>{
 
    const userId= req.userId;
    const organisationId=req.query.organisationId;
    const organisation = ORGANIZATIONS.find(
    org => org.id == organisationId
);

     if(!organisation || organisation.admin !=userId) {
    res.status(411).json({
        message: "Incorrect Org's or You are not Admin of the org"
    })
    return
   }

   res.json({
    organisation: {
        ...organisation,
        member: organisation.member.map(memberId => {
            const user= USERS.find(user => user.id ===memberId);
            return {
                id: user.id,
                username: user.username
            }
        })
    }
   })
})

app.get('/board',(req,res)=>{

})
app.get('/issues',(req,res)=>{
    
})
app.get('/members',(req,res)=>{
    
})

app.put('/issues',(req,res)=>{

})

app.delete('/members',authMiddleware,(req,res)=>{

     const userId=req.userId;
    const organisationId= req.body.organisationId;
    const memberUserUsername= req.body.memberUserUsername;

    const organisation =ORGANIZATIONS.find(org => org.id=== id);


   if(!organisation || organisation.admin !=userId) {
    res.status(411).json({
        message: "Incorrect Org's or You are not Admin of the org"
    })
    return
   }

   const memberUser = USERS.find(u => u.username === memberUserUsername);
  if(!memberUser){
     res.status(411).json({
        message: "No user with this username Exist in our Db"
    })
    return
  }


   organisation.member = organisation.member.filter(user =>user.id !== memberUser.id);

  res.json({
    message: "new member added!"
  })


})


app.listen(3000);



