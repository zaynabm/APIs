var db=require('./connect')
var config=require('../../config')
var hf=require('../../helperFuncs')
var log =require('../../helperFuncs').log
var debug =require('../../helperFuncs').debug

var stationID=config.config.stationID
var normalizedPath = require("path").join(__dirname, "./models");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./models/" + file)
});
////**********************************************************************************************************
if(!db.connected) db.connect
//... check user's RFID ......................................................................................
exports.checkUserRFID=function(userRFID){
    return new Promise(function(resolve, reject) {
        if(db.connected)
            db.mongoose.model("users").findOne({"userRFID":userRFID},{"_id":false,"userName":true,"userRFID":true},function(err,resp){
                if (!err ) {
                    if(resp !=null ){
                        debug("DONE-checkUserRFID      : userRFID:"+resp.userRFID);
                        resolve({result:true,data:resp})
                    }else{
                        debug("DONE-checkUserRFID      : " + userRFID + " NOT found!!");
                        resolve({result:false,msg:"userRFID NOT found!"})
                    }
                }else {
                    throw err;
                    debug("ERROR-checkUserRFID      : "+err);
                    resolve({result:false,msg:err})
                }
            });
            else{
                debug("ERROR-checkUserRFID      : "+db.mongoErr);
                resolve({result:false,msg: db.mongoErr})
            }
    });
}
//... check bike's RFID ......................................................................................
// exports.checkBikeRFID=function(bikeRFID){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("bikes").findOne({"bikeRFID":bikeRFID},function(err,resp){
//                 if (!err ) {
//                     if(resp !=null ){
//                         debug("DONE-checkBikeRFID      : bikeRFID:"+resp.bikeRFID);
//                         resolve({result:true})
//                     }else{
//                         errmsg=bikeRFID + " NOT found!!"
//                         debug("DONE-checkBikeRFID      : " + errmsg);
//                         resolve({result:false,msg:errmsg})
//                     }
//                 }else {
//                     throw err;
//                     debug("ERROR-checkBikeRFID      : "+err);
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-checkBikeRFID      : "+db.mongoErr);
//             resolve({result:false,msg:db.mongoErr})
//         }
//     });
// }
//... check user Password ....................................................................................
exports.checkUserPassword=function(userRFID,userPassword){
    return new Promise(function(resolve, reject) {
        if(db.connected)
            db.mongoose.model("users").findOne({"userRFID":userRFID},{"_id":false,"userName":true,"userRFID":true,"userPassword":true},function(err,resp){
                if (!err ) {
                    if(resp!=null){
                        if(resp.userPassword == userPassword ){
                            debug("DONE-checkUserPassword      : valid userPassword");
                            resolve({result:true,data:resp})
                        }else{
                            var msg = "Incorrect Password!!"
                            debug("DONE-checkUserPassword      : "+msg);
                            resolve({result:false,msg:msg})
                        }
                    }else resolve({result:false,msg:"userRFID NOT found!"})
                }else {
                    throw err;
                    debug("ERROR-checkUserPassword      : "+err);
                    resolve({result:false,msg:err})
                }
            });
        else{
            debug("ERROR-checkUserPassword      : "+db.mongoErr);
            resolve({result:false,msg:db.mongoErr})
        }
    });
}
//... check vaid user ........................................................................................
exports.checkValidUser=function(userRFID){
    return new Promise(function(resolve, reject) {
        if(db.connected)
            db.mongoose.model("users").findOne({"userRFID":userRFID},function(err,resp){
                if (!err){
                    var msg;
                    if(resp!=null ){
                        if(resp.isActive=="true"){
                            if(resp.userStatus == "OFF"){
                                resolve({result:true})
                            }else{
                                var msg = " user already have a bike !!"
                                debug("ERROR-checkValidUser     : "+userRFID, msg);
                                resolve({result:false,msg:msg})
                            }
                        }else{
                            var msg = " DEACTIVE user !!"
                            debug("ERROR-checkValidUser     : "+userRFID, msg);
                            resolve({result:false,msg:msg})
                        }
                    }else{
                        msg = " INVALID userRFID !!"
                        debug("DONE-checkValidUser      : " + userRFID +msg);
                        resolve({result:false,msg:msg})
                    }
                }else {
                    throw err;
                    debug("ERROR-checkValidUser      : "+err);
                    resolve({result:false,msg:err})
                }
            });
        else{
            debug("ERROR-checkValidUser      : "+db.mongoErr);
            resolve({result:false,msg:db.mongoErr})
        }
    });
}
//... check valid bike  ......................................................................................
// exports.checkValidBike=function(bikeRFID){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("bikes").findOne({"bikeRFID":bikeRFID},function(err,resp){
//                 if (!err){
//                     var msg;
//                     if(resp!=null ){
//                         if(resp.bikeStatus !="ON"){
//                             resolve({result:true})
//                         }else{
//                             var msg = "Bike is ON  !!"
//                             debug("ERROR-checkValidBike     : "+bikeRFID, msg);
//                             resolve({result:false,msg:msg})
//                         }
//                     }else{
//                         msg = " INVALID bikeRFID!!"
//                         debug("DONE-checkValidBike      : " + bikeRFID+msg);
//                         resolve({result:false,msg:msg})
//                     }
//                 }else {
//                     throw err;
//                     debug("ERROR-checkValidBike      : "+err);
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-checkValidBike      : "+db.mongoErr);
//             resolve({result:false,msg:db.mongoErr})
//         }
//     });
// }
//... RENT ...................................................................................................
exports.rent=function(userRFID,bikeRFID){
    return new Promise(function(resolve, reject) {
        if(db.connected){
            // var userObj={
            //     isSync:"false",
            //     lastUpdate:hf.getCurrentTime(),
            //     userStatus:"ON"
            // }
            // var bikeObj={
            //     isSync:"false",
            //     lastUpdate:hf.getCurrentTime(),
            //     bikeStatus:"ON",
            //     currentUser : userRFID,
            //     lastRentTime:hf.getCurrentTime()
            // }
            var actionObj={
                action:"RENT",
                isSync:"false",
                stationID:stationID,
                userRFID:userRFID,
                // duration: "-",
                bikeRFID:bikeRFID,
                time:hf.getCurrentTime()
            }
            // var stationObj= {
            //     $inc:{"freeDocks":-1},
            //     "isSync":"false"
            // }
            var funcList = []
            // funcList.push(updateUser(userRFID,userObj))
            // funcList.push(updateBike(bikeRFID,bikeObj))
            funcList.push(updateAction(actionObj))
            // funcList.push(updateStation(stationObj))

            Promise.all(funcList).then(values => {
                var updateDone =true
                var errMsg;
                values.forEach((value)=>{
                    if(value.result!=true ){
                        updateDone=false
                        errMsg=value
                    }
                })
                if(updateDone) resolve({result:true,data:{rentAction:"done"}})
                else{
                    debug("ERROR-rent      : "+errMsg)
                } resolve({result:false,msg:errMsg})
            })
        }else{
            debug("ERROR-rent      : "+db.mongoErr);
            resolve({result:false,msg:db.mongoErr})
        }
    });
}
//... BACK ...................................................................................................
exports.back=function(bikeRFID){
    return new Promise(function(resolve, reject) {
        if(db.connected){
            // getCurrentUserRFID(bikeRFID).then((userRFID,err)=>{
            //     var userRFID = userRFID
            //     if(!err){
                    // getDuration(bikeRFID).then((res,err)=>{
                    //     if(!err){
                            // if(res.result){
                                // var duration = res.duration
                                // var userObj={
                                //     isSync:"false",
                                //     lastUpdate:hf.getCurrentTime(),
                                //     userStatus:"OFF"
                                // }
                                // var bikeObj={
                                //     isSync:"false",
                                //     lastUpdate:hf.getCurrentTime(),
                                //     bikeStatus:"OFF",
                                //     currentUser : "none"
                                // }
                                var actionObj={
                                    action:"BACK",
                                    isSync:"false",
                                    stationID:stationID,
                                    // userRFID:userRFID,
                                    bikeRFID:bikeRFID,
                                    time:hf.getCurrentTime(),
                                    // duration: duration
                                }
                                // var stationObj= {
                                //     $inc:{"freeDocks":1},
                                //     "isSync":"false"
                                // }
                                var funcList = []
                                // funcList.push(updateUser(userRFID,userObj))
                                // funcList.push(updateBike(bikeRFID,bikeObj))
                                funcList.push(updateAction(actionObj))
                                // funcList.push(updateStation(stationObj))

                                Promise.all(funcList).then(values => {
                                    var updateDone =true
                                    var errMsg;
                                    values.forEach((value)=>{
                                        if(value.result!=true ){
                                            updateDone=false
                                            errMsg=value
                                        }
                                    })
                                    if(updateDone) resolve({result:true,data:{backAction:"done"}})
                                    else {
                                        debug("ERROR-back      : "+errMsg);
                                        resolve({result:false,msg:errMsg})
                                    }
                                })
                            // } else resolve ({result:false,msg:"can NOT get duration !!"})
                    //     }else resolve ({result:false,msg:err})
                    // })
                // } else{
                //     debug("ERROR-back      : "+err);
                //     resolve ({result:false,msg:err})
                // }
            // })
        }else{
            debug("ERROR-back      : "+db.mongoErr);
            resolve({result:false,msg:db.mongoErr})
        }
    });
}
//...test.......................................................................................
exports.test=function(){
    debug("Hello From Mongo DB :D !!");
}
////**********************************************************  helper functions  ************************************************
// function updateUser(userRFID,obj){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("users").update({"userRFID":userRFID},obj,{ upsert: true },function(err,resp){
//                 if (!err) resolve({result:true})
//                 else{
//                     debug("ERROR-updateUser   :"+err)
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-updateUser   :"+err)
//             resolve({result:false,msg:db.mongoErr})
//         }
//
//     });
// }
// function updateBike(bikeRFID,obj){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("bikes").update({"bikeRFID":bikeRFID},obj,{ upsert: true },function(err,resp){
//                 if (!err ) resolve({result:true})
//                 else{
//                     debug("ERROR-updateBike   :"+err)
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-updateBike   :"+db.mongoErr)
//             resolve({result:false,msg:db.mongoErr})
//         }
//     });
// }
function updateAction(obj){
    return new Promise(function(resolve, reject) {
        if(db.connected){
            var actionModel= db.mongoose.model("actions")
            var newAction= new actionModel();

            newAction.userRFID= obj.userRFID ;
            newAction.bikeRFID= obj.bikeRFID ;
            newAction.stationID= obj.stationID;
            newAction.action= obj.action;
            newAction.time= obj.time;
            newAction.isSync=obj.isSync;
            newAction.duration=obj.duration;;

            newAction.save(function(err){
                if(!err) resolve({result:true})
                else{
                    debug("ERROR-updateAction  :"+err)
                    resolve({result:false,msg:err})
                }
            });
        }else{
            debug("ERROR-updateAction  :"+db.mongoErr)
            resolve({result:false,msg:db.mongoErr})
        }
    });
}
// function updateStation(obj){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("stations").update({"stationID":stationID},obj,{ upsert: true },function(err,resp){
//                 if (!err) resolve({result:true})
//                 else {
//                     debug("ERROR-updateStation  :"+err)
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-updateStation  :"+db.mongoErr)
//             resolve({result:false,msg:db.mongoErr})
//         }
//
//     });
// }
// function getCurrentUserRFID(bikeRFID){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("bikes").findOne({"bikeRFID":bikeRFID},function(err,resp){
//                 if (!err ) resolve(resp.currentUser)
//                 else {
//                     debug("ERROR-getCurrentUserRFID  :"+err)
//                     resolve({result:false,msg:err})
//                 }
//             });
//             else{
//                 debug("ERROR-getCurrentUserRFID  :"+db.mongoErr)
//                 resolve({result:false,msg:db.mongoErr})
//             }
//     });
// }
// function getDuration(bikeRFID){
//     return new Promise(function(resolve, reject) {
//         if(db.connected)
//             db.mongoose.model("bikes").findOne({"bikeRFID":bikeRFID},function(err,resp){
//                 if (!err){
//                     if(resp!=null ){
//                         var lastRentTime=resp.lastRentTime
//                         var duration = hf.timeDiffInMin(lastRentTime,hf.getCurrentTime())
//                         resolve({result:true,duration:duration})
//                     }else{
//                         msg = " INVALID bikeRFID!!"
//                         debug("ERROR-getCurrentUserRFID  :"+msg)
//                         resolve({result:false,msg:msg})
//                     }
//                 }else {
//                     debug("ERROR-getCurrentUserRFID  :"+err)
//                     resolve({result:false,msg:err})
//                 }
//             });
//         else{
//             debug("ERROR-getCurrentUserRFID  :"+db.mongoErr)
//             resolve({result:false,msg:db.mongoErr})
//         }
//     });
// }
