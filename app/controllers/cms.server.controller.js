var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');
var Cms = require('../models/cms.server.model').Cms;

/*************
Purpose: cms insert (insert based on url)
Parameter: {
    title:'contact', 
    content: ''
}
Return: json string
****************/
exports.insert = (req,res)=>{
    var params = ['title','content','metaTitle','metaDescription','metaKeyword','pageId'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var newCms =  new Cms();
        newCms.title = req.body.title;
        newCms.content = req.body.content;
        newCms.metaTitle = req.body.metaTitle;
        newCms.metaDescription = req.body.metaDescription;
        newCms.metaKeyword = req.body.metaKeyword;
        newCms.pageId = req.body.pageId;
        newCms.save((err,data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1, message:'Save successfully', data:data});
            }
        });
    }
}


/*************
Purpose: cms update (update based on url )
Parameter: {
    title:'contact', 
    content: ''
}
Return: json string
****************/

exports.update = (req,res)=>{
    var params = ['title', 'content','metaTitle','metaDescription','metaKeyword','pageId'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        Cms.find({pageId:req.body.pageId}).exec((err,data)=>{
            if(err){
                res.send({status:0, message:err});
            }else if(data.length>0){
                Cms.update({pageId:req.body.pageId},{title:req.body.title, content:req.body.content, metaTitle:req.body.metaTitle, metaDescription:req.body.metaDescription, metaKeyword:req.body.metaKeyword}).exec((err,result)=>{
                    if(err){
                        res.send({status:0, message:err});
                    }else{
                        res.send({status: 1, message:'cms update successfully', data:result});
                    }
                });
            }else{
                res.send({status:0, message:'cms not found'})
            }
        });
    }
}

/*************
Purpose: cms delete
Parameter: {
    
}
Return: json string
****************/

exports.delete = (req,res)=>{
    Cms.findByIdAndUpdate(req.body.cid,{$set:{deleteStatus:true}}).exec((err, data)=>{
        if(err){
            res.send({status:0, message:error});
        }else{
            res.send({status:1, message:'delete successfully', data:data});
        }
    });
}

/*************
Purpose: cms list
Parameter: {
    page:1,
    pagesize:10,
    sort:{"_id":1} // not required
}
Return: json string
****************/


exports.list = (req,res)=>{
    var params = ['page','pagesize'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var page = parseInt(req.body.page, 10);
        var pagesize = parseInt(req.body.pagesize, 10);
        var skip = (page-1)*pagesize;
        var sort = {'createdAt':-1}
        if(req.body.hasOwnProperty('sort')){
            sort = req.body.sort;
        }
        Cms.find({deleteStatus:false}).skip(skip).limit(pagesize).sort(sort).exec((err, data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                Cms.find({deleteStatus:false}).exec((err,total)=>{
                    if(err){
                        res.send({status:0, message:err});
                    }else{
                        res.send({status:1, message:'Cms list', data:data,page:page,pagesize:pagesize,total:total.length});
                    }
                });
                
            }
        });
    }
}

/*************
Purpose: cms detail
Parameter: {
    cid:242462385398
}
Return: json string
****************/

exports.details = (req,res)=>{
    var params = ['cid'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        Cms.find({_id:req.body.cid}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err}); 
                return false;
            }else if(result.length<0){
                res.send({status:0, message:'nt find cms detail'});
                return false;
            }
            res.send({status:1, message:'cms detail', data:result[0]});
        });
    }
}