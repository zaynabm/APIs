var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var users=new Schema({
  userRFID:{
  	type:String,
  	required: true,
  	lowercase: true,
  	index:{unique: true}
  },
  userPassword:String,
  userName:String,
  userStatus:String,
  lastUpdate:String,
  isSync:String,
  isActive:String
})
// ORM
mongoose.model("users",users)
