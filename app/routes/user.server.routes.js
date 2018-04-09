var authTokenData = require('../models/authTokenData.server.model').AuthTokenData;
var globalMethods = require('../../configs/globals');

module.exports = function(app, express){
    // app.use(globalMethods.checkAccess)
    var user = require('../controllers/user.server.controller');
    var router = express.Router();
    
    router.post('/login', user.login);
    router.post('/register', user.register);
    router.post('/profile', globalMethods.checkAuth, user.profile);
    router.post('/forgotPassword', user.forgotPassword);
    router.post('/resetPassword', user.resetPassword);
    router.post('/changePassword', globalMethods.checkAuth, user.changePassword);
    router.post('/editProfile', globalMethods.checkAuth, user.editProfile);
    router.post('/uploadphoto', globalMethods.checkAuth, user.uploadPhoto);
    
    router.get('/mailVerification1', user.mailVerification1);
    router.post('/test',  user.test);
    // router.post('/uploadFile',csvUpload, userListing.uploadFile);
    // router.post('/csvUpload', user.csvUpload);
    router.post('/feedback', globalMethods.checkAuth, user.feedback);

       
    app.use(config.baseApiUrl, router);


}