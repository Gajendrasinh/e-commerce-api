var config  = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

exports.getMessage = (req,res)=>{
    res.send({status:1, message:' Hello, API is Start'});
}

