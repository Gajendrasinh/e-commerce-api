var mongoose = require('mongoose');
var schema = mongoose.Schema;
var crypto = require('crypto');


var user = new schema({
    firstname : {type:String ,required:true},
    lastname : {type:String ,required:true},
    emailId : {type : String, required: true, unique:true},
    password : { type: String, required : true},
    photo : {type : String, required : false},
    username : {type : String, required : true},
    verificationStatus : {type:Boolean, required: true, default:false},
    deleteStatus :{ type:Boolean, default:false},
    status:{type:Boolean, default:false},
    // address : {type : String, required : false},
    // city : {type : String, required : [false, 'why no city']},
    // state : {type : String, required : false},
    mobile : { type: Number, require: true},
    verificationToken: {type:String}
},{
    timestamps:true
});



var userModel = mongoose.model('User', user);

module.exports = {
    User : userModel
}