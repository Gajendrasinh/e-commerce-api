var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

module.exports = (app, express)=>{
    var router = express.Router();
    var index = require('../controllers/index.server.controller');

    router.get('/getMessage', index.getMessage);

    app.use(config.baseApiUrl, router);
}