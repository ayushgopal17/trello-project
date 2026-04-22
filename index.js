const express=require ("express");

let USERS_ID =1;
let ORGANIZATIONS_ID=1;
let BOARDS_ID=1;
let ISSUES_ID=1;

const USERS=[{
    id:1,
    username: "Ayush",
    password: "123123"
}]
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

app.post('/singup',(req,res)=>{

    const username= req.body.username;
    const password= req.body.password;

    const userExist= USERS.find(u=> u.username === username);
    if(userExist){
        res.status(411).send({
            message: "User With this Username Already Exists"
        })
    }
})

app.post('/singin',(req,res)=>{

})

app.post('/organizations',(req,res)=>{

})
app.post('/add-member-to-org',(req,res)=>{

})

app.post('/board',(req,res)=>{

})

app.post('/issue',(req,res)=>{

})

app.get('/board',(req,res)=>{

})
app.get('/issues',(req,res)=>{
    
})
app.get('/members',(req,res)=>{
    
})

app.put('/issues',(req,res)=>{

})

app.delete('/members',(req,res)=>{

})


app.listen(3000);