//// station 2\
//// APIs
var stationID = "s222"

var envs = {
  "dev" : {
      "Name" : "Dev",
      "debug" : true,
      "log" : true
  },
  "production" : {
      "Name" : "Production",
      "debug" : false,
      "log" : true
  }
};
var databases = {
  "mongo" : {
      "host" : "127.0.0.1",
      "port" : "27017",
      "dbName" : "stebn2",
      "driver" : "mongo/DBfunctions.js"
  }
};
var responseObj=function(msg,data,statusCode){
    response = {
        msg:msg,
        data:data
    }
    return response
}

exports.config = {
  "env" : envs["dev"],
  "database" : databases["mongo"],
  "stationID":stationID,
  "HttpResp":responseObj
};
