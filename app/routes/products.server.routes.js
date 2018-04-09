var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');
var product = require('../controllers/product.server.controller');

module.exports = (app, express)=>{    
    var router = express.Router();
    router.post('/addProduct', product.addProduct)
    router.post('/addCategory', product.addCategory)
    router.post('/AddProductType', product.AddProductType)

    app.use(config.baseApiUrl, router);
}