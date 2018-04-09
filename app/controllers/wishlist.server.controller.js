var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

var async = require('async');

var UserWishlist = require('../models/userWishlist.server.model').UserWishlist;

 /*******************
Purpose : add product in user wishlist
Parameters : {
    "pid":'5aab60a9fa8a15078227d974",
    "uid":"2344344345345"
    
}  
Retuen : json string 
 *******************/

exports.addUserWishList = (req,res)=>{
    var params = ['pid', 'uid'];
    var error = globalMethods.checkRequireParam(params ,req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var addwishlist = new UserWishlist();
        addwishlist.pid = req.body.pid;
        addwishlist.uid = req.body.uid;
        addwishlist.save((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1, message:'Add to wishlist'});
            }
        });
    }
}

/*******************
Purpose : user wishlist
Parameters : {
    "uid":"2344344345345"
}  
Retuen : json string 
 *******************/
exports.userWishlist = (req,res)=>{
    var params = ['uid'];
    var error = globalMethods.checkRequireParam(params,req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        UserWishlist.find({deleteStatus:false}).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1,message:'User wish list', data:data});
            }
        });
    }
}

/*******************
Purpose : delete user wishlist
Parameters : {
    "wid":"2344344345345"
}  
Retuen : json string 
 *******************/
exports.deleteUserWishlist = (req,res)=>{
    var params = ['wid'];
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        UserWishlist.findByIdAndUpdate(req.body.wid, {deleteStatus:true},{new:true}).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1,message:'Delete product from User wish list', data:data});
            }
        });
    }
}

/*******************
Purpose : delete user wishlist
Parameters : {
    "wid":"2344344345345"
}  
Retuen : json string 
 *******************/

exports.deleteUserWishlists = (req, res)=>{
    var params = ['wids'];
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        UserWishlist.findByIdAndUpdate(req.body.wid, {deleteStatus:true},{new:true}).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1,message:'Delete product from User wish list', data:data});
            }
        });
    }
}

/*******************
Purpose : Product Specific wishList
Parameters : {
    "pid":"2344344345345"
}  
Retuen : json string 
 *******************/


 exports.productSpcificWishList = (req, res)=>{
     var params = ['pid'];
     var error = globalMethods.checkRequireParam(params, req);
     if(error.length>0){
        res.send({status:0, message:error});
     }else{
        UserWishlist.find({pid:req.body.pid}).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1, message:''})
            }
        });
     }
 }