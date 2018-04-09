var mongoose = require('mongoose');
var schema = mongoose.Schema;

var authSchema = new schema({
    email : {type:String, required: true},
    token : {type:String, required:true},
    status: {type:String, required:true},
    timestamp : {type:Number},
    role:{type:String, required:true}
},
{   
    collection : 'authtokendata',
    timestamps:true
}
);

var authModel = mongoose.model('authtokendata',authSchema);

module.exports = {
    AuthTokenData : authModel
}