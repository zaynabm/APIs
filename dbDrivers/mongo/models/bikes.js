var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var bikes=new Schema({
  bikeRFID:{
  	type:String,
  	required: true,
  	lowercase: true,
  	index:{unique: true}
  },
  bikeStatus:String,
  bikeName:String,
  station:String,
  currentUser:String,
  lastUpdate:String,
  isSync:String,
  isActive:String,
  lastRentTime:String
})
// ORMs
mongoose.model("bikes",bikes)
