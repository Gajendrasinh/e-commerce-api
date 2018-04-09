var globalMethods = require('./../../configs/globals');
var config = require('./../../configs/configs');

var _ = require('lodash');
var async = require('async');

var userRating = require('./../models/userRatings.server.model').userRating;

/*************
Purpose: user rating list for admin view
Parameter: {
    page:1,
    pagesize:10,
    sort:{'rate':1}
}
Return: JSON String
****************/

exports.userRatingListing = (req,res)=>{
    var params = ['page','pagesize'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var page = parseInt(req.body.page,10);
        var pagesize = parseInt(req.body.pagesize,10);
        var sort = {'createdAt':-1};
        if(req.body.hasOwnProperty('sort')){
            sort = req.body.sort;
        }
        var skip = (page-1)*pagesize;
        var index = _.findIndex(config.adminEmails, req.body.email);
        if(req.body['role'] == 'admin'){
            userRating.find({deleteStatus:false},{__v:0}).skip(skip).limit(pagesize).sort(sort).exec((err,list)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    userRating.find({deleteStatus:false}).exec((err, total)=>{
                        if(err){
                            res.send({status:0, message: error});
                        }else{
                            res.send({status:1, message:'User rating list', page:page, pagesize:pagesize,total:total.length, data:list});
                        }
                    });

                    
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }
    
}

/*************
Purpose: edit user rating by Admin
Parameter: {
    rid:'156385313.3' // not editable only for update data
    verifiedStatus:'active',
    title:'product',
    description:'best product ever',
    rate:5
}
Return: JSON String
****************/

exports.editUserRating = (req,res)=>{
    var params = ['rid','verifiedStatus','title','description','rate'];
    var error = globalMethods.checkRequireParam(params, req);
    var index = _.findIndex(config.adminEmails, req.body.email);
    if(req.body['role'] == 'admin' ){
        if(error.length>0){
            res.send({status:0, message:error});
        }else{
            userRating.findByIdAndUpdate(req.body.rid,{verifiedStatus:req.body.verifiedStatus,title:req.body.title,description:req.body.description,rate:req.body.rate},{new:true}).exec((err,data)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1, message:'update userRating successfully', data:data});
                }
            });
        }
    }else{
        res.send({status:0, message:'Invalid user'});
    }
}

/*************
Purpose: delete user rating by Admin
Parameter: {
    rid:"23904" // not editable only for update data
}
Return: JSON String
****************/

exports.deleteUserRating = (req,res)=>{
    params = ['rid'];

    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        if(req.body['role'] == 'admin'){
            userRating.findByIdAndUpdate(req.body.rid,{deleteStatus:true}).exec((err, result)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1,message:'Delete user rating'});
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }

}

/*************
Purpose: delete users rating by Admin
Parameter: {
    rids:"34534783,2347924792"  // not editable only for update data (comma seperated string)
}
Return: JSON String
****************/
exports.deleteUserRatings = (req,res)=>{
    params = ['rids'];
    var error =globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        if(req.body['role'] == 'admin'){
            var users = req.body.rids.toString().split(",");
            var calls = [], errUser = [],successUser = [];
            console.log("user = ",users)
            users.forEach((id)=>{
                calls.push((callback)=>{
                    userRating.findByIdAndUpdate(id,{deleteStatus:true}).exec((err, detail)=>{
                        if(err){
                            errUser.push(id);
                            callback(true, err);
                            // res.send({status:0, message:err});
                        }else{
                            successUser.push(id)
                            callback(false, 'Success');
                        }
                    });
                });
            });

            async.parallel(calls, (err, data)=>{
                if(err){
                    res.send({status:0, message:err, errorUser:errUser,successUser:successUser});
                }else{
                    res.send({status:1, message:'Delete user rating.'});
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }
}

/*******************
Purpose : approve user rating by admin
Parameters : {
    rid:'5aab60a9fa8a15078227d974',
}  

Retuen : json string 
 *******************/

 exports.approveUserRating = (req, res)=>{
    var params = ['rid'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        userRating.findByIdAndUpdate(req.body.rid, {verifiedStatus:true},{new:true}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status: 1, message:'User rating approved .', data:result});
            }
        });
    }
 }

 /*******************
Purpose : reject user rating by admin
Parameters : {
    rid:'5aab60a9fa8a15078227d974',
    
}  

Retuen : json string 
 *******************/

exports.rejectUserRating = (req, res)=>{
    var params = ['rid'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        userRating.findByIdAndUpdate(req.body.rid, {verifiedStatus:false},{new:true}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status: 1, message:'User rating rejected .', data:result});
            }
        });
    }
 }