var config =require('./config').config

exports.debug=function(msg){
    if(config.env.debug)
        console.log(msg);
}
exports.log=function(msg){
    if(config.env.log)
        console.log(msg);
}
exports.getCurrentTime=function(){
    var offset = 2
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return nd.toLocaleString();
}
exports.timeDiffInMin=function(d1,d2){
    var date1 = new Date(d1)
    var date2 = new Date(d2)
    return Math.round((date2.getTime()-date1.getTime())/60000)
}
