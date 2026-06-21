const mongoose= require("mongoose")
mongoose.connect("mongodb+srv://Ayushmongodb:WBujynVgBTWoz9QZ@cluster0.c4dgxv6.mongodb.net/trello")

const userSchema= mongoose.Schema({
    username: String,
    password:String
})

const OrganisationSchema=mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    member:[mongoose.Types.ObjectId]

})

const organisationModel=mongoose.model("organisation",OrganisationSchema);
const usersModel=mongoose.model("users",userSchema);

module.exports={
    organisationModel,usersModel
}