var mongoose  = require('mongoose');
var schema = mongoose.Schema;
var cmsSchema = new schema({
    title:{type:String, required:true}, 
    content:{type:String, required:true},
    
    deleteStatus:{type:String,default:false},
    pageId:{type:String, required:true, unique:true},
    metaTitle:{type:String},
    metaDescription:{type:String},
    metaKeyword:{type:String, required:true}
},{
    timestamps:true
});

var cmsModel = mongoose.model('cmsData',cmsSchema);


module.exports = {
    'Cms':cmsModel
}