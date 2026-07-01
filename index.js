
//Task left->
// -> password hashing
//-> frontend

const express= require("express")
const jwt= require("jsonwebtoken")
const {authmiddleware}= require("./middleware");
const {userModel,organisationModel,boardModel,issueModel} = require("./models")
const mongoose=require("mongoose");
const { Result } = require("pg");
const bcrypt=require("bcrypt");
const z=require("zod");

const app=express();


const SignupSchema= z.object({
    username:z.string().min(3),
    password: z.string().min(8)
})

app.use(express.json());
// let USERS_ID=1;
// let ORGANISATIONS_ID=1;
// let BOARDS_ID=1;
// let ISSUES_ID=1;

// const USERS=[];
// const ORGANISATIONS=[];
// const BOARDS=[];
// const ISSUES=[];

// Name of project WorkSync 

// create 

app.post("/signup",async (req,res)=>{

    try{
    

    
    const {data,success,error}= SignupSchema.safeParse(req.body)

    if(!success){
      return  res.status(400).json({
            message: "Incorrect inputs" , error: error.issues
        })
      
    }

    const username=data.username;
    const password= data.password;



    //const userExist= USERS.find(u=> u.username === username);
    const userExist= await userModel.findOne({
        username: username
    })
   

    if(userExist){
      return  res.status(409).json({
            message: "User with this Username already exist"
        })
     
    }
      const hashedpassword=await bcrypt.hash(password,10);

//   USERS.push({
//         username: username,
//         password: password,
//         id: USERS_ID++
//     })
const user= await userModel.create({
    username,
    password: hashedpassword
})


  return  res.status(201).json({
        message : "you have successfully signed up",
        id: user._id
    })
    }
    catch(err){
        console.error(err);
return res.status(500).json({
    message: "internal server Error"
})
    }
})

const signinSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8)
})

app.post("/signin",async (req,res)=>{
    try{

    

    const { data,success,error} =signinSchema.safeParse(req.body);

    if(!success){
      return  res.status(400).json({
            message: "Incorrect Inputs",
            error: error.issues
        })
          }

    const username= data.username;
    const password= data.password;

    //const userExist= USERS.find(u=> u.username === username && u.password === password)

    const userExist=await userModel.findOne({
        username
        
    })

    if(!userExist){
      return  res.status(403).json({
            message: "Incorrect credientials"
        })
        
    }
    
const correctpassword= await bcrypt.compare(password,userExist.password)
    
  if(correctpassword){
    const token= jwt.sign({
        userId: userExist._id

    },process.env.JWT_SECRET);

 return res.json({
    token
})

}

   return res.status(401).json({
        message: "Incorrect credientials"
    })
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            message: "Internal error occured"
        })
    }

})

const organisationSchema= z.object({
    title: z.string().min(3),
    description: z.string().min(5)
})

app.post("/organisation",authmiddleware,async (req,res)=>{
    try{

    

const {data ,success,error}=organisationSchema.safeParse(req.body);

if(!success){
    return res.status(400).json({
        message: "Incorrect Inputs",
        error: error.issues
    })
}

const {title,description}= data;
     const userId= req.userId;
    //  ORGANISATIONS.push({
    //     id: ORGANISATIONS_ID++,
    //     title: req.body.title,
    //     description: req.body.description,
    //     admin: userId,
    //     members:[]
    //  })

     const organisation= await organisationModel.create({
       //title:req.body.title,
        //description: req.body.description,
        title,
        description,
        admin: userId,
        members:[]
     })
     return res.status(201).json({
        message: "organisation created successfully",
        id: organisation._id
     })
    }
    catch(err){
        console.error(err)
    return res.status(500).json({
    message: "Internal error occured"
   })
    }
    
})

const addmemberorgSchema= z.object({
    organisationId: z.string(),
     memberUserUsername: z.string().min(3)

})
app.post("/add-member-to-organisation",authmiddleware, async(req,res)=>{

try{


const {data,success,error}= addmemberorgSchema.safeParse(req.body);

if(!success){
    return res.status(400).json({
    message: "Incorrect Input",
    error: error.issues
    })
}

    const userId= req.userId;
     const organisationId=data.organisationId;
     const memberUserUsername= data.memberUserUsername;

     //const organisation= ORGANISATIONS.find(org=> org.id=== organisationId);
     const organisation= await organisationModel.findOne({
       _id: organisationId
     })
     if(!organisation || organisation.admin.toString() != userId){
        res.status(403).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }

     //const memberUser= USERS.find(u=> u.username=== memberUserUsername);
     const memberUser= await userModel.findOne({
        username: memberUserUsername
     })

     if(!memberUser){
        res.status(403).json({
            message: "No user with this username in our db"
        })
        return
     }
     //organisation.members.push(memberUser.id);
    //  const response =await organisationModel.updateOne(
    //     {
    //     _id: organisationId
    //  },
    //     {$push: {
    //         "members": memberUser._id
    //     }
    //     }
    //  )
    
    organisation.members.push(memberUser._id)
    await organisation.save()
     const updatedOrg = await organisationModel.findById(organisationId);

     res.json({
        message: "New member added"
     })
    }
    catch(err){
        
        console.error(err)
     return   res.status(500).json({
       message: "Internal Server error"
        })

    }

})


const boardSchema=z.object({
    organisationId: z.string(),
    title: z.string().min(3)
})
app.post("/board",authmiddleware,async(req,res)=>{

    try{

    
const {data,success,error}= boardSchema.safeParse(req.body)

 if(!success){
   return res.status(403).json({
        message: "Incorrect input",
        error: error.issues
    })
 }

    const userId=req.userId;
    
    const organisationId=data.organisationId;
    const title=data.title;
 
   // const organisation= ORGANISATIONS.find( org=> org.id=== organisationId);
const organisation= await organisationModel.findOne({
      _id: organisationId
})

    if(!organisation || organisation.admin.toString() !=userId){
        res.json({
            message: "either wrong organisation or you are not an admin"
        })
        return
    }
    // BOARDS.push({
    //     id:BOARDS_ID++,
    //     title: title,
    //     organisationId: organisationId
    // });

  const board=  await boardModel.create({
        title,
         organisationId
    })

    res.json({
        message: "Board created",
        id: board._id
    })
}
     catch(err){
         console.error(err)
   return res.status(500).json({
    message: "Internal Error"
   
   })

}
})


const issueSchema=z.object({
    boardId: z.string(),
    title: z.string().min(3),
    description: z.string(),
    status: z.string()

})
app.post("/issues",authmiddleware, async(req,res)=>{

    try{
const {data,success,error}= issueSchema.safeParse(req.body);

if(!success){
    return res.json({
        message: "Invalid credientials",
        error: error.issues
    })
}

const boardId=data.boardId;
const title=data.title;
const description=data.description;
const status=data.status;

//const board= BOARDS.find(board=> board.id ===boardId);
const board= await boardModel.findOne({
    _id: boardId
})

if(!board ){
    res.status(400).json({
        message: " your board does not exist"
    })
    return
}
// ISSUES.push({
//     id: ISSUES_ID++,
//     title,
//     description,
//     status,
//     boardId

// })

 const issue =await issueModel.create({
    title,
    description,
    status,
    boardId
})
res.json({
    message: "Issue created",
   // id: ISSUES_ID-1
   id: issue._id
})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            message: "Internal error"
        })
    }
})

app.get("/organisation",authmiddleware,async(req,res)=>{
    const userId=req.userId;
   const organisationId = req.query.organisationId;

   // const organisation= ORGANISATIONS.find(org=> org.id === organisationId);
   const organisation= await organisationModel.findOne({
    _id: organisationId
   })
     if(!organisation || organisation.admin.toString() != userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }

     const members=await userModel.find({
        _id: organisation.members
     })

     res.json({
        organisation: {
      title: organisation.title,
      description: organisation.description,
      members: members.map(m =>({
        username: m.username,
        id: m._id
      }))


        }
            
        
     })
})

//
app.get("/boards",authmiddleware, async(req,res)=>{

    const userId=req.userId;
    const organisationId=req.query.organisationId;
   // const organisation= ORGANISATIONS.find(
      //  org=> org.id === organisationId);
      const organisation= await organisationModel.findOne({
       _id: organisationId
      })
    if(!organisation || organisation.admin.toString() != userId){
       return res.status(403).json({
            message: "Either organisation does not exist or you are not an admin"
        })
    }
    // const board= BOARDS.filter(
    //     board=> board.organisationId=== organisationId
    // );
    const boards = await boardModel.find({
       organisationId
    })
    res.json({
        boards
    })

})
//
app.get("/issues",authmiddleware, async(req,res)=>{

    const boardId=req.query.boardId;
    //const board= BOARDS.find(board=> board.id== boardId)
    const board= await  boardModel.findOne({
      _id:  boardId
    })
    if(!board ){
        res.status(403).json({
            message: "Board not found"
        })
        return
    }
    // const issues=ISSUES.filter(
    //     issue=> issue.boardId=== boardId
    // )

    const issues= await issueModel.find({
        boardId
    })
    
    res.json({
        issues
    })
})

//
app.get("/members",authmiddleware, async(req,res)=>{
const userId=req.userId;
const organisationId= req.query.organisationId

// const organisation= ORGANISATIONS.find(
//     org=> org.id ===organisationId
// );

const organisation=  await organisationModel.findOne({
  _id:  organisationId
})

if(!organisation){
    res.status(403).json({
        message: "organisation not found"
    });
    return
}

// const member=organisation.members.map(memberId=>{
//     const user= USERS.find(
//         user=> user.id===memberId
//     );
const members= await userModel.find({
    _id: {
        $in: organisation.members
    }
});
    // return{
    //     id: user.id,
    //     username: user.username
    // }
// })

const result= members.map(user =>({
    id: user._id,
    username: user.username
}))
 res.json({
    members: result
})
})

//
// Update

const issueSchemaa= z.object({
    issueId: z.string(),
    status: z.string()
})
app.put("/issues",authmiddleware, async (req,res)=>{

    try{

    
    const{ data,success,error}= issueSchemaa.safeParse(req.body);

    if(!success){
        return res.status(400).json({
            message: "Invalid credientials",
            error: error.issues
        })
    }

    const issueId=data.issueId;
    const status=data.status;

    // const issue= ISSUES.find(
    //     issue=> issue.id=== issueId
    // );

    const issue= await issueModel.findOne({
        _id: issueId
    })

    if(!issue){
        return res.status(404).json({
            message: "issue not found"
        });
    }
    issue.status=status;
    await issue.save();
    res.json({
        message:"Issue updated"
    })
}
catch(err){
    console.error(err)
   return res.status(500).json({
        message: "Internal error "
    })
}
})
//
const memberSchema= z.object({
    organisationId: z.string(),
    memberUserUsername: z.string()
})
app.delete("/members",authmiddleware,async(req,res)=>{
    try{

    
const {data,success,error}= memberSchema.safeParse(req.body)

if(!success){
    return res.status(400).json({
        message: "Invalid credientials",
        error: error.issues
    })
}
const userId= req.userId;
     const organisationId=data.organisationId;
     const memberUserUsername= data.memberUserUsername;


     //const organisation= ORGANISATIONS.find(org=> org.id=== organisationId);
     const organisation= await organisationModel.findById(
      organisationId
     )
     if(!organisation || organisation.admin.toString() != userId){
        res.status(403).json({
            message: "Either this org doesn't exist or you are not a member of this org"
        })
        return
     }

     //const memberUser= USERS.find(u=> u.username=== memberUserUsername);
     const memberUser= await userModel.findOne({
        username: memberUserUsername
     })

     if(!memberUser){
        res.status(404).json({
            message: "No user with this username in our db"
        })
        return
     }
    // organisation.members= organisation.members.filter(id => id !== memberUser.id);
    // await organisationModel.updateOne({
    //     _id: organisationId
    // },{
    //     "$pullAll": {
    //         member: memberUser._id
    //     }
    // })
    organisation.members= organisation.members.filter(x => x.toString() !=memberUser._id.toString());
    await organisation.save();

     res.json({
        message: "member deleted"
     })
    }
    catch(err){
console.error(err)
return res.status(500).json({
    message: "Internal Error "
})
    }
})

app.listen(3000);