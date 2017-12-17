var config =require('./config').config
var log =require('./helperFuncs').log
var debug =require('./helperFuncs').debug
//----------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------- APIs----------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------------------------------------//
var port = 9999
var express = require("express")
 , bodyParser = require('body-parser');
var app=express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());
app.use(function (err, req, resp, next) {
    if(err) {
        msg = "Bad json object"
        data ={}
        statusCode = 400
        resp.statusCode= statusCode
        resp.send(config.HttpResp(msg,data))
    }
})


var loginController=require("./controllers/login");
var actionsController=require("./controllers/actions");

app.use("/login",loginController);
app.use("/actions",actionsController)

app.listen(port);
debug("Hello from port "+port+" :D" );

process.on('unhandledRejection', (reason, p) => {
  log('Unhandled Rejection at: Promise'+ p+ 'reason:'+ reason);
});
