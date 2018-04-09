var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

module.exports = (app, express)=>{

    var router = express.Router();




    app.use(config.baseApiUrl, router);
}