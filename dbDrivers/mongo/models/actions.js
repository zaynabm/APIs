var mongoose=require("mongoose")
// register model
var Schema=mongoose.Schema
var actions=new Schema({
    "action":String,
    "isSync":String,
    "stationID": String,
    "userRFID": String,
    "bikeRFID": String,
    // "duration":String,
    "time": String
})
// ORM
mongoose.model("actions",actions)
