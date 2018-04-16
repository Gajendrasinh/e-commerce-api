
var globalMethods = require('../../configs/globals');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.jpg');
    }
});

var upload = multer({ storage: storage }).single('photo');

module.exports = function(app, express){
    // app.use(globalMethods.checkAccess)
    var admin  = require('../controllers/admin.server.controller');
    var product = require('../controllers/product.server.controller');
    var router = express.Router();
    
    router.post('/adminRegister', admin.register);
    router.post('/adminLogin', admin.login);
    router.post('/adminForgotPassword', admin.forgotPassword);
    router.post('/adminChangePassword', globalMethods.checkAuth, admin.changePassword);
    router.post('/adminResetPassword', admin.resetPassword);
    router.post('/adminLogout', admin.logout);
    router.post('/addProduct', globalMethods.checkAuth, product.addProduct);

    app.use(config.baseApiUrl, router);


}