var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');
var product = require('../controllers/product.server.controller');

module.exports = (app, express) => {
    var router = express.Router();
    router.post('/addProduct', product.addProduct)
    router.post('/addCategory', product.addCategory)
    router.post('/AddProductType', product.AddProductType)
    router.post('/updateCategory', product.updateCategory)
    router.post('/updateProduct', product.updateProduct)
    router.post('/updateProductType', product.updateProductType)

    router.post('/deleteProduct', product.deleteProduct)
    router.post('/deleteCategory', product.deleteCategory)
    router.post('/deleteProductType', product.deleteProductType)

    router.get('/getProductByID/:id', product.getProductByID)
    router.get('/getProducts', product.getProducts)

    router.get('/getCategories', product.getCategories)
    router.get('/getProductsByCategoryID/:id', product.getProductsByCategoryID)

    router.get('/getProductTypes', product.getProductTypes)
    router.get('/getCategotyByProductTypeID', product.getCategotyByProductTypeID)
    

    app.use(config.baseApiUrl, router);
}