var config = require('./configs');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var path = require('path');
var authTokenData = require('../app/models/authTokenData.server.model').AuthTokenData;
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: "meanstack2017@gmail.com",
        pass: "Mean@123"
    },
    tls: { rejectUnauthorized: false },
    debug: true
});
/*************
Purpose: Custom Console.log to Enable Disable by Flag
Parameter: {
	config.CONSOLELOGFLAG: true means Shows Logs else hide logs
}
Return: String
****************/
log = (a, b) => {
    if (typeof config.CONSOLELOGFLAG != "undefined" && config.CONSOLELOGFLAG == true) {
        if (a == undefined) {
            console.log()
        } else if (b == undefined) {
            console.log(a);
        } else {
            console.log(a, b);
        }
    }
};
// Global Error Function Do Not Delete.
sendErr = (e, m) => { return { status: 0, statusCode: 500, message: e._message || e, msg: m, error: e.message } };
sendSuccess = (d, m) => { return { status: 1, statusCode: 200, message: m, data: d } };
/*************
Purpose: Grenerate Token using JWT
Parameter: {
	logindetails: It accept username and password of user
}
Return: String
****************/
exports.getToken = function (logindetails) {

    var token = jwt.sign({
        auth: logindetails,
        algorithm: "HS256",
        exp: Math.floor(new Date().getTime() / 1000) + config.tokenExpiry
    }, config.securityToken);
    return token;
}

/*************
Purpose: It check token expiration
Parameter: {
	token: Token generated for a user.
}
Return: Boolean
****************/
function checkExpiration(token) {
    var decoded = jwt.decode(token);
    let now = parseInt(new Date().getTime() / 1000);
    let expTime = decoded.exp
    if (now > expTime) {
        return false;
    } else {
        return true;
    }

}

/*************
Purpose: It is created to check the useris suthorised or not
Parameter: {
	token: Token generated for a user.
}
Return: Number/Object
******************/
exports.isAuthorised = function (token) {
    let arrToken = global.permission
    let len = arrToken.length;
    console.log("length", len)
    if (len) {
        for (let i = 0; i < len; i++) {
            //console.log("toke: ",arrToken[i].tokenID)
            if (arrToken[i].tokenID == token) {
                if (checkExpiration(token)) {
                    val = {
                        email: '' + arrToken[i].emailID + '',
                        role: '' + arrToken[i].role + ''
                    };
                    break;
                } else {
                    val = 0
                }

            } else {
                val = 0;
            }

        }
        return val;
    } else {
        return undefined;
    }
}

/*************
Purpose: Checking the role Admin/User
Parameter: {
	emailID: The email Id need to check for admin
}
Return: Boolean
****************/
exports.checkAdmin = function (emailID) {
    let admins = config.adminEmails.split(',')
    for (var i = 0; i < admins.length; i++) {
        if (admins[i] == emailID) { return true }
    }
    return false;
    /*return emailID == 'chandrakanta1@indianic.com' || emailID == 'chandrakanta@indianic.com' || emailID == 'chandrakanta2@indianic.com'*/
}

/*************
Purpose: Remove duplicate logged in user 
Parameter: {
	emailID: N/A
}
Return: Array 
****************/
exports.eliminateDuplicates = function (arr) {
    function compare(a, b) {
        if (a.emailID < b.emailID)
            return -1;
        if (a.emailID > b.emailID)
            return 1;
        return 0;
    }

    arr.sort(compare);

    if (arr.length > 1) {
        for (var i = 0; i < arr.length - 1; i++) {

            if (arr[i].emailID == arr[i + 1].emailID) {

                arr.splice(i, 1)
            }
        }
        return arr;
    } else {
        return arr;
    }
}

exports.getTokenIndex = function (arrToken, token) {
    console.log("to: ", token)
    let len = arrToken.length;
    console.log("len: ", len)
    if (len) {
        for (var i = 0; i < len; i++) {
            if (arrToken[i].tokenID == token) {
                return i;
            }

        }
    } else {
        return -1;
    }
}


// purpose = create for send mail 

function sendEmail(mailOption, callback) {
    smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
            callback(true, err);
        } else {
            callback(false, info);
        }
    });
}

// use for authtoken

exports.checkAuth = (req, res, next) => {
    if (req.headers.hasOwnProperty('auth')) {
        var token = req.headers.auth;
        console.log(32)
        authTokenData.find({ token: token }).exec((err, data) => {
            if (err) {
                console.log(35)
                res.send({ status: 0, message: err });
            } else if (data.length > 0) {
                console.log(39)
                data = data[0];
                var timeStamp = data.timestamp;
                console.log("last timestamp = " + timeStamp);
                console.log("current timestamp = " + Date.now());
                if (timeStamp > Date.now()) {
                    console.log(41);
                    jwt.verify(token, config.securityToken, (err, decoded) => {
                        if (err) {
                            res.send({ status: 0, message: 'Session has been expired' });
                        } else {
                            console.log(decoded);
                            req.body.email = decoded.auth.email;
                            req.body.id = decoded.auth.id;
                            if (decoded.auth['role']) {
                                req.body.role = decoded.auth.role;
                            }
                            return next();
                        }
                    });

                } else {
                    console.log(42)
                    res.send({ status: 0, message: 'Session has been expired' });
                }
            } else {
                res.send({ status: 0, statusCode: 401, message: 'Unauthorised user' });
            }
        });
    } else {
        res.send({ status: 0, statusCode: 401, message: 'Unauthorised user' });
    }


}

/* 
Purpose: for encrypate passsword 
messge: here passsword is encrypte using sha256 and use crypto module
*/

exports.encryptPassword = (password) => {

    return crypto.createHmac('sha256', 'indianic').update(password).digest('hex');
}

/*
purpose : check require parameter for call api
message : It is used for check all required parameter is available in req.body or req.params and also check it is not emapty ,undefined or null

*/

exports.checkRequireParam = (params, req, next) => {
    if (Array.isArray(params)) {
        log('params', params)
        log('req', req)
        let calls = [];
        let erData = [];
        params.forEach((param) => {
            if (!req.body.hasOwnProperty(param)) {
                erData.push('please send required parameter : ' + param);
                // callback(true, 'please send required parameter : '+param);
            } else {
                if ((req.body[param] == undefined || req.body[param] == null || req.body[param] == "")) {
                    erData.push('Parameter not have empty :' + param);
                    // callback(true, 'Parameter not have empty :'+param);
                }
            }
        });
        return erData;
    }
}

/*
    check admin have access API or not 

*/

exports.checkAccess = (req, res, next) => {
    var path = req.path;
    let data = req.path;
    console.log(path);
    var paths = config.adminAccess;
    var result = false;
    for (var i = 0; i < paths.length; i++) {

        console.log(paths[i]);
        if (path == paths[i]) {
            console.log(11);
            result = true;
        }
    }
    if (result == false) {
        console.log(10);
        res.send({ status: 0, message: "You can't access this API." });
    } else {
        return next();
    }



}

/*
    decode access_token and get data of user
*/
exports.getDecodedToken = (access_token) => {
    // console.log("token = "+access_token);
    let result;
    jwt.verify(access_token, config.securityToken, (err, decoded) => {
        if (err) {
            // console.log(err);
            console.log(12);
            result = false;
            return reuslt;
        } else {
            console.log(1234);
            console.log(decoded);
            result = decoded;
            return result;
        }
    });
}

exports.generateToken = (payload) => {
    var token = jwt.sign(payload, config.securityToken, { expiresIn: 120000 });
    return token;
}

exports.registrationEmail = (token, email, callback) => {

    var mailOption = {
        from: 'meanstack2017@gmail.com',
        to: email,
        subject: 'Verification Mail'
    }

    // /Volumes/Data/API-NODE/API-Node-2.0.0/configs/html
    var link = config.rootURL + 'api/mailVerification1?token=' + token;

    console.log(__dirname);
    // var loc = __dirname + '/../../configs/html/mailTemlate.html';
    var loc = path.join(__dirname, 'html', 'mailTemplate.html');
    fs.readFile(loc, 'utf-8', (err, html) => {
        if (err) {
            callback(true, err);
            // res.send({status:0, message:err});
        } else {
            console.log(168);
            html = html.replace('heding', 'Email Verification');
            html = html.replace('content', '<p>Please verified your emailId .Click below link for verified User </p><h5>' + link + '<h5><p> The above link expired within 24 hours.</p>');
            console.log(171);
            console.log(mailOption);
            mailOption.html = html;
            sendEmail(mailOption, (err, data) => {
                if (err) {
                    console.log(175);
                    callback(true, err);
                } else {
                    console.log(178);
                    callback(false, data);

                    // res.send({status:1, message:'Please check your email'});
                }
            });
            // console.log(168);
        }
    });
}

exports.forgotPasswordEmail = (token, email, callback) => {

    var mailOption = {
        from: 'meanstack2017@gmail.com',
        to: email,
        subject: 'Reset Password'
    }

    // /Volumes/Data/API-NODE/API-Node-2.0.0/configs/html
    var link = config.rootURL + 'api/resetPassword?token=' + token

    console.log(__dirname);
    // var loc = __dirname + '/../../configs/html/mailTemlate.html';
    var loc = path.join(__dirname, 'html', 'mailTemplate.html');
    fs.readFile(loc, 'utf-8', (err, html) => {
        if (err) {
            callback(true, err);
        } else {
            console.log(168);
            html = html.replace('heding', 'Reset Password');
            html = html.replace('content', '<p>Your Reset password link is below </p><h5>' + link + '<h5><p> The above link expired within 24 hours.</p>');
            console.log(171);
            console.log(mailOption);
            mailOption.html = html;
            sendEmail(mailOption, (err, data) => {
                if (err) {
                    console.log(175);
                    callback(true, err);
                } else {
                    console.log(178);
                    callback(false, data);
                }
            });
            // console.log(168);
        }
    });
}

// exports.storage = ()=>{
//     var storageD = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null,'./public/uploads')
//         },
//         filename: function (req, file, cb) {
//             var s = file.originalname.split(".");
//             var ext = s[(s.length-1)];
//             cb(null, Date.now()+"."+ext);
//         }
//     });
//     return storageD;
// }