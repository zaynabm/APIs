var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var stations=new Schema({
  stationID:{
  	type:String,
  	required: true,
  	lowercase: true,
  	index:{unique: true}
  },
  stationName:String,
  totalDocks:Number,
  freeDocks:Number,
  lastUpdate:String,
  location:String,
  status:String,
  isSync:String,
  isActive:String
})
// ORM
mongoose.model("stations",stations)
