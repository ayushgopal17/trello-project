// const dotenv=require("dotenv").config()
// const mongoose=require("mongoose")
// mongoose.connect(process.env.MONGO_URL);

// const userSchema= new mongoose.Schema({
//     username: String,
//     password: String,
   
// })

// const organisationSchema= new mongoose.Schema({
//     title: String,
//     description: String,
//     id: mongoose.Types.ObjectId,
//     member: [mongoose.Types.ObjectId]
// })

// const organisationModel= mongoose.model("organisation",organisationSchema);
// const userModel=mongoose.model("user",userSchema);

// module.exports={
//     organisationModel,userModel
// }



const dotenv=require("dotenv").config()
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const userSchema= new mongoose.Schema({
    username: String,
    password: String
})

const organisationSchema= new mongoose.Schema({
    title : String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members :[mongoose.Types.ObjectId]
})

const boardSchema= new mongoose.Schema({

    title: String,
    organisationId: mongoose.Types.ObjectId
})

const issueSchema= new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    boardId: mongoose.Types.ObjectId
})


const userModel=mongoose.model("user",userSchema);
const  organisationModel=mongoose.model("organisation",organisationSchema);
const boardModel=mongoose.model("board",boardSchema);
const issueModel=mongoose.model("issue",issueSchema);
module.exports={
    userModel,organisationModel,boardModel,issueModel
}