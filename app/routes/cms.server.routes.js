var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

module.exports = function(app, express){
    var cms = require('../controllers/cms.server.controller');
    var router = express.Router();

    router.post('/cmsInsert', globalMethods.checkAuth, cms.insert);
    router.post('/cmsUpdate', globalMethods.checkAuth, cms.update);
    router.post('/cmsDelete', globalMethods.checkAuth, cms.delete);
    router.post('/cmsList', globalMethods.checkAuth, cms.list);
    router.post('/cmsDetail', globalMethods.checkAuth, cms.details);

    app.use(config.baseApiUrl, router);
}