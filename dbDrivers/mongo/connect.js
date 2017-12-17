var config=require('../../config')
var log =require('../../helperFuncs').log
var debug =require('../../helperFuncs').debug
dbConfig=config.config.database
var mongoose=require("mongoose");
mongoose.Promise = require('bluebird');

var dbURL = "mongodb://"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.dbName
var mongoErr
mongoose.connection.on('connected', function (ref) {
    exports.connected=true;
    log('connected to mongo serverrr.');
});
mongoose.connection.on('disconnected', function (ref) {
    mongoErr='disconnected from mongo server.'
    exports.connected=false;
    exports.mongoErr=mongoErr
    debug(mongoErr)
    connect()
});
mongoose.connection.on('close', function (ref) {
    mongoErr='close connection to mongo server'
    exports.connected=false;
    exports.mongoErr=mongoErr
    debug(mongoErr)
});
mongoose.connection.on('error', function (err) {
    mongoErr='error connection to mongo server! '+ err
    exports.connected=false;
    exports.mongoErr=mongoErr
    debug(mongoErr)
});
mongoose.connection.on('reconnect', function (ref) {
    mongoErr='reconnect to mongo server.'
    exports.connected=true;
    exports.mongoErr=mongoErr
    debug(mongoErr)
});
function connect(){
    mongoose.connect(dbURL,{useMongoClient:true,autoReconnect:true}).then((res,err) => {
        exports.mongoose=mongoose
    })
}
exports.connect=connect()
