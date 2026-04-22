const express=require ("express");

const users=[{
    id:1,
    username: "Ayush",
    password: "123123"
},
{
    id:2,
    username: "Aman",
    password: "123456"
}]
const boards=[{
    id:1,
    title: "100xdevs",
    description: "Learning coding platform",
    admin: 1,
    member: [2]
},{
    id:2,
    title: "Ayush's Org",
    description: "Learning",
    admin: 1,
    memeber: []
}];
const organisations=[{
    id:1,
    title: "100xschool website (frontend)",
    organisationId:1
}];

const issues=[{
    id:1,
    title: "Add dark mode",
    boardId: 1
},{
    id:2,
    title: "Allow admin to create more courses",
    boardId:2
}];
const issues=[];


const app= express()

app.listen(3000);