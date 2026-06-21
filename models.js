const mongoose= require("mongoose")
mongoose.connect("yourmongourl")

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
