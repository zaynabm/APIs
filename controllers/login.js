var express=require("express");
var bodyParser=require("body-parser");
var log =require('../helperFuncs').log
var debug =require('../helperFuncs').debug
var router=express.Router();
var errmsg

var db=require("../dbDrivers/mongo/DBfunctions")
var config =require('../config').config
var errmsg
router.post("/checkRFID",function (req,resp) {
    var msg,data,statusCode;
    if (req.body.userRFID){
        var userRFID = req.body.userRFID
        db.checkUserRFID(userRFID).then((res,err)=>{
            if(res.result){
                resp.statusCode= 200
                resp.send(config.HttpResp("KO",res.data))
            }else{
                log("ERROR-checkUserRFID:   "+res.msg)
                resp.statusCode= 404
                resp.send(config.HttpResp(res.msg,{}))
            }
        })
    }else{
        errmsg="Body missing userRFID"
        log("ERROR-checkUserRFID:   "+errmsg)
        resp.statusCode= 400
        resp.send(config.HttpResp(errmsg,{}))
    }
})
router.post("/checkPassword",function (req,resp) {
    if(req.body.userRFID){
        if(req.body.userPassword){
            var userRFID = req.body.userRFID
            var userPassword = req.body.userPassword
            db.checkUserPassword(userRFID,userPassword).then((res,err)=>{
                if(res.result){
                    resp.statusCode= 200
                    resp.send(config.HttpResp("KO",res.data))
                }else{
                    log("ERROR-checkPassword:   "+res.msg)
                    resp.statusCode= 500
                    resp.send(config.HttpResp(res.msg,{}))
                }
            })
        }else {
            errmsg="Body missing userPassword"
            log("ERROR-checkPassword:   "+errmsg)
            resp.statusCode= 400
            resp.send(config.HttpResp(errmsg,{}))
        }
    }else{
        errmsg="Body missing userRFID"
        log("ERROR-checkPassword:   "+errmsg)
        resp.statusCode= 400
        resp.send(config.HttpResp(errmsg,{}))
    }
})
module.exports=router;

















// router.post("/checkRFID",function (req,resp) {
//     var userRFID = req.body.userRFID
//     db.checkUserRFID(userRFID).then((res,err)=>{
//         resp.send(res)
//     })
// })
// router.post("/checkPassword",function (req,resp) {
//     var userRFID = req.body.userRFID
//     var userPassword = req.body.userPassword
//
//     db.checkUserPassword(userRFID,userPassword).then((res,err)=>{
//         resp.send(res)
//     })
// })
// module.exports=router;
