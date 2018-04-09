var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

var async = require('async');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var csvjson = require('csvjson');
var converter = require('json-2-csv');
var mv = require('mv');
var multiparty = require('multiparty');

var User = require('../models/user.server.model').User;
var authTokenData = require('../models/authTokenData.server.model').AuthTokenData;
var userRating = require('../models/userRatings.server.model').userRating;

/*************
Purpose: user Login
Parameter: {
    email:abc@gmail.com,
    password:ndfjs21389,

}
Return: JSON String
****************/
exports.login = (req, res) => {
    var params = ['email', 'password'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ 'success': false, 'error': error });
    } else {
        // password = globalMethods.encryptPassword(req.body.password);
        User.find({ emailId: req.body.email, password: req.body.password }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, 'message': err });
            } else if (data.length > 0) {
                var userDetails = data[0];
                /* 
                    check verification status 
                */
                if (userDetails.verificationStatus == false) {
                    var decode = globalMethods.getDecodedToken(userDetails.verificationToken);
                    if (decode) {
                        res.send({ status: 0, message: 'Please verified emailId' });
                    } else {
                        res.send({ status: 0, message: 'Please Register and sign up ' });
                    }
                } else if (userDetails.status == false) {
                    res.send({ status: 0, message: 'You can not login ' });
                } else {
                    let payload = {
                        'email': req.body.email,
                        id: userDetails._id
                    }
                    var token = globalMethods.getToken(payload);
                    var newAuthToken1 = new authTokenData();
                    newAuthToken1.email = req.body.email;
                    newAuthToken1.token = token;
                    newAuthToken1.status = true;
                    newAuthToken1.role = 'user';

                    var d = Date.now();
                    var t = d + 86400000;
                    console.log(d);
                    console.log(t);
                    newAuthToken1.timestamp = t;
                    newAuthToken1.save((err, data) => {
                        if (err) {
                            res.send(sendErr(err));
                        } else {
                            res.send({ status: 1, access_token: token, data: userDetails, message: 'Logged in successfully' });
                        }
                    });
                }
            } else {
                res.send(sendErr(err, 'Invalid credentials'))
            }
        });
    }
};

/*************
Purpose: user register
Parameter: {
	 "email":"john@doe.com",
    "password":"john",
    "firstname":"john",
    "lastname":"Doe",
    "mobile":"987654321",
    "username":"johnDoe"
}
Return: JSON String
****************/
exports.register = (req, res) => {
    var params = ['email', 'firstname', 'lastname', 'mobile', 'username', 'password'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        // var photo = req.file.filename;
        var username = req.body.username;
        var email = req.body.email;
        var mobile = req.body.mobile;

        //  check duplicate username or emailid or mobile
        User.find({ emailId: email }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                res.send({ status: 0, message: 'User is already register Please login using email' });
            } else {
                payload = { 'email': email }
                log(payload);
                var token = globalMethods.generateToken(payload);
                var newUser = new User();
                newUser.firstname = req.body.firstname;
                newUser.lastname = req.body.lastname;
                newUser.emailId = email;
                newUser.mobile = mobile;
                newUser.username = username;
                newUser.password = req.body.password;
                newUser.verificationToken = token;
                newUser.status = true;
                newUser.save((err, data) => {
                    if (err) {
                        res.send({ status: 0, message: err });
                    } else {
                        globalMethods.registrationEmail(token, req.body.email, (err, resp) => {
                            if (err) {
                                res.send({ status: 0, message: err });
                            } else {
                                res.send(sendSuccess('please Check Your Email', 'User register successfully'));
                            }
                        });
                    }
                });
            }
        });

    }

};

/*************
Purpose: forgot Password
Parameter: {
    email:john@gmail.com
}
Return: JSON String
****************/

exports.forgotPassword = (req, res) => {
    var params = ['email'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        // res.send({'success':false, 'error':'Internal server error'});
        User.find({ emailId: req.body.email }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {

                data = data[0];
                payload = { 'email': data.emailId, 'username': data.username, 'id': data._id }
                var token = globalMethods.getToken(payload);
                globalMethods.forgotPasswordEmail(token, req.body.email, (err, result) => {
                    if (err) {
                        res.send({ status: 0, message: result });
                    } else {
                        res.send({ status: 1, message: 'Please check email' });
                    }
                });
            } else {
                res.send({ status: 0, message: 'Please enter register emailId' });
            }
        });
    }
}

/*************
Purpose: user change Password
Parameter: {
    oldPassword:ndfjs21389,
    newPassword:21389
}
Return: JSON String
****************/

exports.changePassword = (req, res) => {
    var params = ['newPassword', 'oldPassword']
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        User.find({ emailId: req.body.email, password: req.body.oldPassword }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                User.update({ emailId: req.body.email }, { password: req.body.newPassword }).exec((err, result) => {
                    if (err) {
                        res.send({ status: 0, message: err });
                    } else {
                        res.send({ status: 1, message: 'Your password change successfully', data: result });
                    }
                });

            } else {
                res.send({ status: 0, message: 'Please enter correct old password' });
            }
        });

        // var enPwd = encryptPassword(req.body.password);
    }
}

/*************
Purpose: user reset Password
Parameter: {
    confirmPassword:ndfjs21389,
    password:ndfjs21389,
    token:""
}
Return: JSON String
****************/

exports.resetPassword = (req, res) => {
    var params = ['token', 'password', 'confirmPassword']
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        if (req.body.password == req.body.confirmPassword) {
            var token = req.body.token;
            jwt.verify(token, config.securityToken, (err, decoded) => {
                if (err) {
                    res.send({ status: 0, message: 'This link is expired please go to forgot Password Link', code: 2 });
                } else {
                    var data = decoded.auth;
                    console.log(data);
                    console.log(req.body.password)
                    User.findOneAndUpdate({ emailId: data.email }, { $set: { password: req.body.password } }).exec((err, userDetail) => {
                        if (err) {
                            res.send({ status: 0, message: 'User not found', code: 3 })
                        } else {
                            res.send({ status: 1, message: 'Password update successfully' });

                        }
                    });
                }
            });
        } else {
            res.send({ status: 1, message: 'Please enter same password in Password feild and confirm password feild', code: 4 });
        }

        // var enPwd = encryptPassword(req.body.password);
    }
}

/*************
Purpose: user profile
Parameter: {
    
}
Return: JSON String
****************/
exports.profile = (req, res) => {
    var params = ['uid'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        console.log('12');
        res.send({ status: 0, message: error });
    } else {
        console.log(34);
        User.find({ _id: req.body.uid }).exec((err, data) => {
            if (err) {
                console.log(89);
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                console.log(90);
                res.send({ status: 1, message: 'User details', data: data[0] });
            } else {
                console.log(100);
                res.send({ status: 0, message: 'User not found', code: 1 })
            }
        });

    }
};

/*************
Purpose: Edit profile of user
Parameter: {
    firstname:john,
    lastname:david,
    mobile:97432133,
    photo:514563223.jpeg
}
Return: JSON String
****************/

exports.editProfile = (req, res) => {
    // var photo = req.file.filename;
    var params = ['uid', 'firstname', 'lastname', 'mobile'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        User.findByIdAndUpdate(req.body.uid, req.body, { new: true }).exec((err, result) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else {
                res.send({ status: 1, message: 'Edit user Profile', data: result });
            }
        });

    }



}
/*************
Purpose: Upload user photo
Parameter: {
    file:
}
Return: JSON String
****************/

exports.uploadPhoto = (req, res) => {
    // if(req.file['filename']){
    //     res.send({status:1, message:' Profile photo upload successfully', data:req.file.filename});
    // }else{
    //     res.send({status:0, message:"Photo can't upload"});      
    // }

    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log(files)
        console.log('fields', fields)
        tmp_path = files.photo[0]['path'];
        img_name = files.photo[0]['originalFilename'];
        var s = img_name.split(".");
        var ext = s[(s.length - 1)];
        var flname = Date.now() + "." + ext;
        // var loc = 
        let pro_pic = path.join(__dirname, '..', '..', 'public', 'uploads', flname);
        console.log(pro_pic);
        // pro_pic = pro_pic.replace(/\s+/g, '');
        if (validateDoc(img_name)) {
            mv(tmp_path, pro_pic, { mkdirp: true }, function (err, data) {
                if (err) {
                    res.send(sendErr(err));
                } else {
                    res.send({
                        status: 1,
                        message: 'image uploaded successfully',
                        path: flname,
                        // title: img_name.replace(/\s+/g, ''),

                    });
                }
            });
        } else {
            res.send({
                status: 0,
                message: "Please use jpg, gif or png"
            });
        }

    });

}

exports.mailVerification = (req, res) => {

    var params = ['token'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {

        User.findOneAndUpdate({ emailId: email, verificationStatus: 'pending' }).exce((err, userDetail) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else {

                userDetail.verificationStatus = 'active';
                userDetail.save((err, result) => {
                    if (err) {
                        res.send({ status: 0, message: err });
                    } else {
                        res.send({ status: 1, message: 'mail verified successfully', data: result });
                    }
                });
            }
        });
    }
}

/*************
Purpose: user verification mail
Parameter: {
    // req.query.token

    token:""
}
Return: JSON String
****************/
exports.mailVerification1 = (req, res) => {
    console.log(req.query.token);
    // res.send(req.query);
    // var decoded = globalMethods.getDecodedToken(req.query.token);
    // console.log(decoded);
    jwt.verify(req.query.token, config.securityToken, (err, decoded) => {
        if (err) {
            console.log("in err");
            res.send({ status: 0, message: err });
        } else {
            console.log(21425);
            var email = decoded.email;
            console.log(decoded);
            User.find({ emailId: email }).exec((err, data) => {
                if (err) {
                    res.send({ status: 0, message: err });
                } else if (data.length > 0) {
                    data = data[0];
                    User.findByIdAndUpdate(data._id, { verificationStatus: true }, { new: true }).exec((err, result) => {
                        if (err) {
                            res.send({ status: 0, message: err });
                        } else {
                            res.send({ status: 1, message: 'verified successfully' });
                        }
                    });
                } else {
                    res.send({ status: 0, message: 'User not Found' });
                }
            });
        }
    });

}


/*************
Purpose: user feedback
Parameter: {
    title:'shoes',
    description:'good product',
    rate:4
}
Return: JSON String
****************/
exports.feedback = (req, res) => {
    params = ['title', 'description', 'rate'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        var feedback = new userRating();
        feedback.user = req.body.email;
        feedback.title = req.body.title;
        feedback.description = req.body.description;
        feedback.rate = parseInt(req.body.rate, 10);
        feedback.save((err, result) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else {
                res.send({ status: 1, message: 'Thank you for Your feedback' });
            }
        });
    }
}

exports.test = (req, res) => {
    var path = __dirname + '../../'
    console.log(JSON.stringify(req));
    res.send({ data: req.path });
}

function isEmpty(obj) {

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});

}

function validateDoc(val) {
    if (val.match(/\.(png|jpg|jpeg)$/)) {
        return true;
    } else {
        return false;
    }
}

/*************
Purpose: user csv upload 
Parameter: {
    // req.file
}
Return: JSON String
****************/
// exports.csvUpload = (req,res)=>{
//     var flname = req.file.filename;
//     var loc = path.join(__dirname, '..','..','public','uploads',flname);
//     // var path =  '/Volumes/Data/Node-API-5.0.0/public/uploads/'+flname;
//     console.log(loc);
//     var data = fs.readFileSync(loc, {encoding:'utf-8'});
//     var options = {
//         delimiter : ',', // optional
//         quote     : '"' // optional
//     } 
//     var jsonData = csvjson.toObject(data, options);
//     var feild = ['emailId','verificationStatus','firstname','lastname','status','username', 'password','mobile', 'deleetStatus','photo']
//     var calls = [];
//     jsonData.forEach((data)=>{
//         calls.push((callback)=>{
//             var newUser = new User();
//             console.log(newUser);
//             console.log("-------------");
//             _.merge(newUser,data);
//             console.log(newUser);
//             newUser.save((err,result)=>{
//                 if(err){
//                     callback(true, err);
//                 }else{
//                     callback(false, result);
//                 }
//             })
//         });
//     });
//     async.parallel(calls, (err,re)=>{
//         if(err){
//             res.send({status:0,message:err});
//         }else{
//             res.send({status:1, message:'upload successfully',data:re});
//         }
//     });
// }

/*
    json to csv
    */

//    var documents = [
//     {
//         Make: 'Nissan',
//         Model: 'Murano',
//         Year: '2013',
//         Specifications: {
//             Mileage: '7106',
//             Trim: 'S AWD'
//         }
//     },
//     {
//         Make: 'BMW',
//         Model: 'X5',
//         Year: '2014',
//         Specifications: {
//             Mileage: '3287',
//             Trim: 'M'
//         }
//     }
// ];


// var json2csvCallback = function (err, csv) {
//     if (err) throw err;
//     console.log(csv);


//     fs.writeFile('./public/uploads/sample.csv',csv, (err,result)=>{
//         if(err){
//             res.send({status:0,message:err});
//         }else{
//             res.sendFile('/Volumes/Data/Node-API-5.0.0/public/uploads/sample.csv')
//         }
//     });


// };

// converter.json2csvPromisified(documents, json2csvCallback);
