var globalMethods = require('../../configs/globals');
var config = require('../../configs/configs');
var Admin = require('../models/admin.server.model').Admin;
var authTokenData = require('../models/authTokenData.server.model').AuthTokenData;
var moment = require('moment');


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
exports.register = (req, res, next) => {
    var params = ['email', 'firstname', 'lastname', 'contactno', 'username', 'password'];
    var error = globalMethods.checkRequireParam(params, req);    
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        // var photo = req.file.filename;
        var username = req.body.username;
        var email = req.body.email;
        var contactno = req.body.contactno;
        //  check duplicate username or emailid or mobile
        Admin.find({ emailId: email }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                res.send({ status: 0, message: 'Admin is already register Please login using email' });
            } else {
                payload = { 'email': email }
                var pass = new Admin();
                var password = pass.generateHash(req.body.password);
                var token = globalMethods.generateToken(payload);
                var newUser = new Admin();
                newUser.firstname = req.body.firstname;
                newUser.lastname = req.body.lastname;
                newUser.emailId = email;
                newUser.contactno = contactno;
                newUser.username = username;
                newUser.password = password;
                newUser.verificationToken = token;
                newUser.status = true;
                newUser.save((err, data) => {
                    if (err) {
                        res.send({ status: 0, message: err });
                    } else {
                        globalMethods.registrationEmail(token, req.body.email, (err, resp) => {
                            res.send(sendSuccess('Admin Registeration SuccessFul'));
                        });
                    }
                });
            }
        });

    }

};

/*************
Purpose: Admin login
Parameter: {
    email:abc@gmail.com,
    password:ndfjs21389
}
Return: JSON String
****************/
exports.login = (req, res) => {
    var params = ['email', 'password'];
    var error = globalMethods.checkRequireParam(params, req);

    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {

        Admin.find({ emailId: req.body.email, password: req.body.password }).exec((err, adminDetail) => {
            if (err) {
                res.send({ status: 0, message: error });
            } else if (adminDetail.length > 0) {

                adminDetail = adminDetail[0];
                var payload = {
                    email: adminDetail.emailId,
                    role: 'admin',
                    id: adminDetail._id
                }
                var token = globalMethods.getToken(payload);

                var newAuthToken1 = new authTokenData();
                newAuthToken1.email = req.body.email;
                // newAuthToken1.id = adminDetail._id;
                newAuthToken1.token = token;
                newAuthToken1.status = 'active';
                newAuthToken1.role = 'admin';

                var d = Date.now();
                var t = d + 86400000;
                console.log(d);
                console.log(t);
                newAuthToken1.timestamp = t;
                newAuthToken1.save((err, data) => {
                    if (err) {
                        res.send({ status: 0, message: err });
                    } else {
                        res.send({ status: 1, access_token: token, data: adminDetail, message: 'Logged in successfully' });
                    }
                });
                // res.send({status:1 , message:'Login successfully', access_token:token, data:adminDetail});
            } else {
                res.send({ status: 0, message: 'Invalid credentail' });
            }
        });
    }
}

/*************
Purpose: Admin forgot Password
Parameter: {
    email:abc@gmail.com,
}
Return: JSON String
****************/

exports.forgotPassword = (req, res) => {
    var params = ['email'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        Admin.find({ emailId: req.body.email }).exec((err, adminDetail) => {
            if (err) {
                res.send({ status: 0, message: error });
            } else if (adminDetail.length > 0) {

                adminDetail = adminDetail[0];
                payload = { 'email': adminDetail.email, 'username': adminDetail.username, 'id': adminDetail._id }
                var token = globalMethods.getToken(payload);
                globalMethods.forgotPasswordEmail(token, req.body.email, (err, result) => {
                    if (err) {
                        res.send({ status: 0, message: result });
                    } else {
                        res.send({ status: 1, message: 'Please check mail' });
                    }
                });
            } else {
                res.send({ status: 0, message: 'Please enter register emialId' });
            }
        });
    }
}

/*************
Purpose: Admin  change Password
Parameter: {
    oldPassword:ndfjs21389,
    newPassword:21389
}
Return: JSON String
****************/

exports.changePassword = (req, res) => {
    var params = ['oldPassword', 'newPassword'];
    var error = globalMethods.checkRequireParam(params, req);
    if (error.length > 0) {
        res.send({ status: 0, message: error });
    } else {
        Admin.find({ emailId: req.body.email, password: req.body.oldPassword }).exec((err, data) => {
            if (err) {
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                Admin.update({ emailId: req.body.email }, { password: req.body.newPassword }).exec((err, result) => {
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
    }
}

/*************
Purpose: Admin reset Password
Parameter: {
    confirmPassword:ndfjs21389,
    password:ndfjs21389,
    token:""
}
Return: JSON String
****************/

exports.resetPassword = (req, res) => {
    var params = ['password', 'token', 'confirmPassword'];
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
                    Admin.findByIdAndUpdate(data.id, { password: req.body.password }, { new: true }).exec((err, adminDetail) => {
                        if (err) {
                            res.send({ status: 0, message: 'Please enter register emailId', code: 3 })
                        } else {
                            res.send({ status: 1, message: 'Password update successfully' });
                            // adminDetail.password = req.body.password;
                            // adminDetail.save((err,result)=>{
                            //     if(err){
                            //         res.send({status:0, message:err});
                            //     }else{
                            //         res.send({status:1, message:'Password update successfully'});
                            //     }
                            // });
                        }
                    });
                }
            });
        } else {
            res.send({ status: 1, message: 'Please enter same password in Password feild and confirm password feild', code: 4 });
        }
    }
}

/*************
Purpose: Admin Profile
Parameter: {
    
}
Return: JSON String
****************/

exports.adminProfile = (req, res) => {

    Admin.find({ emailId: req.body.email }).exec((err, adminDetail) => {
        if (err) {
            res.send({ status: 0, message: err });
        } else {
            res.send({ status: 1, message: 'Admin detail', data: adminDetail });
        }
    });

}

exports.logout = (req, res) => {
    // var flname = new Date.getDa
    moment.locale();
    console.log(moment().format('l'));
    authTokenData.remove({ token: req.headers.auth }).exec((err, data) => {
        if (err) {
            res.send({ status: 0, message: err });
        } else {
            res.send({ status: 1, message: 'Logout successfully', data: moment().format('l') });
        }
    });
}