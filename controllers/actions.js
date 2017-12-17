var express=require("express");
var bodyParser=require("body-parser");
var config =require('../config').config
var log =require('../helperFuncs').log
var debug =require('../helperFuncs').debug
var db=require("../dbDrivers/mongo/DBfunctions")

var router=express.Router();
var errmsg;

router.post("/rent",function (req,resp) {
    if(req.body.userRFID){
        if(req.body.bikeRFID){
            var userRFID = req.body.userRFID
            var bikeRFID = req.body.bikeRFID
            funcList = []
            // funcList.push(db.checkValidBike(bikeRFID))
            funcList.push(db.checkValidUser(userRFID))

            Promise.all(funcList).then(values => {
                var updateDone =true
                var errMsg;
                values.forEach((value)=>{
                    if(value.result!=true ){
                        updateDone=false
                        errMsg = value
                    }
                })
                if (updateDone){
                    db.rent(userRFID,bikeRFID).then((res,err)=>{
                        if(res.result){
                            resp.statusCode= 200
                            resp.send(config.HttpResp("KO",res.data))
                        }else {
                            log("ERROR-rent: rent action done unsuccessfully!!");
                            resp.statusCode= 404
                            resp.send(config.HttpResp(res.msg,{}))
                        }
                    })
                }else{
                    log("ERROR-rent  :Promise.all -> "+errMsg);
                    resp.statusCode= 404
                    resp.send(config.HttpResp(errMsg.msg,{}))
                }
            })
        }else {
            errmsg="Body missing bikeRFID"
            log("ERROR-rent:    "+errmsg)
            resp.statusCode= 400
            resp.send(config.HttpResp(errmsg,{}))
        }
    }else{
        errmsg="Body missing userRFID"
        log("ERROR-rent:    "+errmsg)
        resp.statusCode= 400
        resp.send(config.HttpResp(errmsg,{}))
    }
})
router.post("/back",function (req,resp) {
    if(req.body.bikeRFID){
        var bikeRFID = req.body.bikeRFID
        // db.checkBikeRFID(bikeRFID).then((res,err)=>{
        //     if (res.result)
                // db.checkValidBike(bikeRFID).then((res,err)=>{
                //     if(!res.result){
                        db.back(bikeRFID).then((res,err)=>{
                            if(res.result) {
                                resp.statusCode= 200
                                resp.send(config.HttpResp("KO",res.data))
                            }
                            else {
                                log("ERROR-back    :"+res.msg);
                                resp.statusCode= 404
                                resp.send(config.HttpResp(res.msg,{}))
                            }
                        })
                //     }else{
                //         errmsg = "INVALID bikeRFID"
                //         log("ERROR-back    :"+errmsg);
                //         resp.statusCode= 404
                //         resp.send(config.HttpResp(errmsg,{}))
                //     }
                // })
        //     else {
        //         log("ERROR-back    :"+res.msg);
        //         resp.statusCode= 404
        //         resp.send(config.HttpResp(res.msg,{}))
        //     }
        // })
    }else{
        errmsg="Body missing bikeRFID"
        log("ERROR-back    :"+errmsg)
        resp.statusCode= 400
        resp.send(config.HttpResp(errmsg,{}))
    }
})
module.exports=router;
