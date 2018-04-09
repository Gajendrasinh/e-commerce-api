var mongoose = require('mongoose');
var schema = mongoose.Schema;

var AdminSchema = new schema({
    firstname:{type:String , required:true},
    lastname:{type:String , required:true},
    contactno:{type:Number , required:true},
    password:{type:String , required:true},
    emailId:{type:String , required:true},
    profilePic:{type:String , required:true},
    username:{type:String, required:true}
}, {
    collection: 'admins',
    timestamps:true
});

var adminModel = mongoose.model('admin', AdminSchema);

module.exports = {
    Admin : adminModel
}