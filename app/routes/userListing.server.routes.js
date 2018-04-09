var authTokenData = require('../models/authTokenData.server.model').AuthTokenData;
var globalMethods = require('../../configs/globals');
var multer = require('multer');


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null,'./public/uploads')
//     },
//     filename: function (req, file, cb) {
//         var s = file.originalname.split(".");
//         var ext = s[(s.length-1)];
//         cb(null, Date.now()+"."+ext);
//     }
// });

// var upload = multer({ storage: storage }).single('photo');

// var csvUpload = multer({storage: storage}).single('file');


// var csvUpload = multer({storage: storage1}).single('file');

module.exports = (app, express)=>{

    var userListing = require('../controllers/userListing.server.controller');
    var globalMethods = require('./../../configs/globals');
    var router = express.Router();


    router.post('/userListing', globalMethods.checkAuth, userListing.userListing);
    router.post('/editUserListing', globalMethods.checkAuth, userListing.editUserListing);
    router.post('/deleteUser', globalMethods.checkAuth, userListing.deleteUser);
    router.post('/deleteUsers', globalMethods.checkAuth, userListing.deleteUsers);
    router.post('/uploadFile', globalMethods.checkAuth, userListing.uploadFile);
    router.get('/downloadFile',  userListing.downloadFile);
    router.post('/changeStatusOfUser', globalMethods.checkAuth, userListing.changeStatusOfUser);
    // router.get('/download',globalMethods.checkAuth, userListing.download);


    app.use(config.baseApiUrl, router);

 }