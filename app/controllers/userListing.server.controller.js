var globalMethods = require('../../configs/globals');
var config = require('../../configs/configs');
var User = require('../models/user.server.model').User;

var path = require('path');
var _ = require('lodash');
var async = require('async');
var csvjson = require('csvjson');
var converter = require('json-2-csv');
var mv = require('mv');
var multiparty =require('multiparty');
var moment = require('moment');

/*************
Purpose: User listing for admin
Parameter: {
    page:1,
    pagesize:10,
    sort:{'fistname':1,'emailId':-1}
}
Return: JSON String
****************/
exports.userListing = (req,res)=>{
    var params = ['page','pagesize'];
    var error = globalMethods.checkRequireParam(params,req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var page = parseInt(req.body.page,10);
        var pagesize = parseInt(req.body.pagesize,10);
        var sort = req.body.sort;
        console.log(sort);
        var skip = (page-1)*pagesize;
        console.log("page --" , page);
        console.log("page size--" , skip);
        var sort = {'createdAt':-1}
        if(req.body.hasOwnProperty('sort')){
            sort = req.body.sort;
        }
        // var index = _.findIndex(config.adminEmails, req.body.email);
        if(req.body['role'] == 'admin'){
            User.find({deleteStatus:false}).skip(skip).limit(pagesize).sort(sort).exec((err, result)=>{
                if(err){
                    res.send({status:0, message: err});
                }else{

                    User.find({deleteStatus:false}).exec((err, total)=>{
                        if(err){
                            res.send({status:0, message: error});
                        }else{
                            res.send({status:1, message:'user listing ', data:result, total:total.length, page: page, pagesize:pagesize});
                        }
                    });
                    
                }
            });   
            
        }else{
            res.send({status:0, message: 'Invalid user'});
            
        }
    }
} 

/*************
Purpose: edit user by admin
Parameter: {
    email:john@gmail.com,// not editable for update user
    firstname:John
    lastname:David
    mobile:1234567890,
    username:john123,
    status:'active',
    deleteStatus:'disable'
}
Return: JSON String
****************/

exports.editUserListing = (req,res)=>{
    var params = [ 'uid', 'firstname', 'lastname', 'mobile','username'];
    console.log(req.body);
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{

        if(req.body['role'] == 'admin'){

            User.findByIdAndUpdate(req.body.uid, req.body,{new:true},(err,data)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1, message:'User Update successfully', data:data});
                }
            });
            
        }else{
            res.send({status:0, message: 'Invalid User '});
        }

        
    }


}

/*************
Purpose: delete user by admin
Parameter: {
    useremail:john@gmail.com,
}
Return: JSON String
****************/

exports.deleteUser = (req,res)=>{
    var params = ['uid'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{
        console.log(req.body.role)
        if(req.body['role'] == 'admin' ){
            User.findByIdAndUpdate(req.body.uid,{deleteStatus:true},{new:true},(err,data)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1, message:'User Delete successfully', data:data});
                }
            });
           
        }else{
            res.send({status:0, message: 'Invalid User '});
        }
        
    }
}

/*************
Purpose: delete user by admin
Parameter: {
    useremails:john@gmail.com,bob@gmail.com // comma seperated string of emails
}
Return: JSON String
****************/

exports.deleteUsers = (req,res)=>{
    var params = [ 'uids'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{
        
        if(req.body['role'] == 'admin'){
            var calls = [];
            var errUser = [], success = [];
            var emails = req.body.uids.split(",");
            console.log(emails)
            emails.forEach(id=>{
                calls.push((callback)=>{
                    User.findByIdAndUpdate(id,{deleteStatus:true},{new:true},(err,data)=>{
                        if(err){
                            errUser.push(id);
                            callback(false, err);
                            // res.send({status:0, message:err});
                        }else{
                            success.push(id);
                            callback(false, data);
                            // res.send({status:1, message:'User Delete successfully', data:data});
                        }
                    });
                   
                });
            });

            async.parallel(calls, (err, result)=>{
                if(err){
                    res.send({status:0, message: 'some user are not delete ', deletedUser: success, error:errUser});
                }else{
                    res.send({status:1, message: 'All user delete', deletedUser:success, errorUser:errUser});
                }
            });
        }else{
            res.send({status:0, message: 'Invalid User '});
        }
        
    }
}

/*************
Purpose: download user list file (CSV format)
Parameter: {

}
Return: csv file
****************/

exports.downloadFile = (req,res)=>{
    moment.locale();
    User.find({},{_id:0, __v:0,photo:0,updatedAt:0,createdAt:0}).lean().exec((err,userDetails)=>{
        if(err){
            console.log(82)
            res.send({status:0, message:err});
        }else{
            
            var json2csvCallback = function (err, csv) {
                if (err) {
                    console.log(err);
                    res.send({status:0, message:err});
                }else{
                    // console.log(csv);
                    var flname = moment().format('DD-MM-YYYY').toString()+".csv";
                    var loc = path.join(__dirname,'..','..','public','uploads',flname);
                    console.log(loc);
                    fs.writeFile(loc,csv, (err,result)=>{
                        if(err){
                            console.log(432);
                            console.log(moment.format('l'));
                            res.send({status:0,message:err});
                        }else{
                            
                            let csvFile = path.join('public','uploads',flname);                
                            res.send({status:1, message:'csv file path', data:csvFile});
                        }
                    });
                }
            }
            converter.json2csvPromisified(userDetails, json2csvCallback);
        }
    });
}

/*************
Purpose: upload user list file (CSV format)
Parameter: {

}
Return: json string
****************/
exports.uploadFile = (req,res)=>{
    // console.log(req);
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log(files)
        console.log('fields', fields)
            tmp_path = files.csv[0].path;
            img_name = files.csv[0].originalFilename;
            var s = img_name.split(".");
            var ext = s[(s.length-1)];
            var flname = Date.now()+"."+ext;
            // var loc = 
            let pro_pic = path.join(__dirname, '..','..','public','uploads',flname);
            console.log(pro_pic);
            // pro_pic = pro_pic.replace(/\s+/g, '');
            if (validateDoc(img_name)) {
                mv(tmp_path, pro_pic, { mkdirp: true }, function (err, data) {
                    if (err) {
                        res.send({status:0, message:err});
                    } else {
                        // res.send({
                        // status: 1,
                        // message: 'image uploaded successfully',
                        // path: flname,
                        // // title: img_name.replace(/\s+/g, ''),
                        
                        // });


                        var data = fs.readFileSync(pro_pic, {encoding:'utf-8'});
                        var options = {
                            delimiter : ',', // optional
                            quote     : '"' // optional
                        } 
                        var jsonData = csvjson.toObject(data, options);
                        //var feild = ['emailId','verificationStatus','firstname','lastname','status','username', 'password','mobile', 'deleetStatus','photo']
                        var calls = [], availableUser = [], addUser = [], errUser = [];
                        jsonData.forEach((data)=>{
                            calls.push((callback)=>{
                                User.find({emailId:data.emailId}).exec((err, user)=>{
                                    if(err){
                                        errUser.push(data,emailId);
                                        callback(true, err);
                                    }else if(user.length>0){
                                        availableUser.push(data.emailId);
                                        callback(false, user);
                                    }else{
                                        var newUser = new User();
                                        console.log(newUser);
                                        console.log("-------------");
                                        _.merge(newUser,data);
                                        console.log(newUser);
                                        newUser.save((err,result)=>{
                                            if(err){
                                                errUser.push(data.emailId);
                                                callback(true, err);
                                            }else{
                                                addUser.push(data.emailId);
                                                callback(false, result);
                                            }
                                        });
                                    }
                                });
                                
                            });
                        });
                        async.parallel(calls, (err,re)=>{
                            if(err){
                                res.send({status:0,message:re, insertUserList:addUser, availableUser:availableUser});
                            }else{
                                res.send({status:1, message:'upload successfully',insertUserList:addUser, availableUser:availableUser});
                            }
                        });
                    }
                });
            } else {
                res.send({
                status: 0,
                message: "Please use csv file"
                });
            }
        
    });
}
 
exports.changeStatusOfUser = (req,res)=>{
    var params = ['status','uid'];
    // req.body = JSON.stringify(req.body)
    console.log("-----------")
    console.log(req.body.status);
    console.log("-----------")
    console.log(req.body.uid);
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        User.findByIdAndUpdate(req.body.uid, {status:req.body.status},{new:true}).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status: 1, message: 'Change Status of user ', data:data});
            }
        });
    }
}

function validateDoc(val){
    if (val.match(/\.(csv)$/)) {
        return true;
    } else {
        return false;
    }
}