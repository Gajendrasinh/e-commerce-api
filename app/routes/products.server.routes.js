var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');
var product = require('../controllers/product.server.controller');

module.exports = (app, express) => {
    var router = express.Router();
    router.post('/addProduct', product.addProduct)
    router.post('/addCategory', product.addCategory)
    router.post('/AddSubCategory', product.AddSubCategory)
    
    router.post('/updateCategory', product.updateCategory)
    router.post('/updateProduct', product.updateProduct)
    router.post('/updateSubCategory', product.updateSubCategory)

    router.post('/deleteProduct', product.deleteProduct)
    router.post('/deleteCategory', product.deleteCategory)
    router.post('/deleteSubCategory', product.deleteSubCategory)

    router.get('/getProductByID/', product.getProductByID)
    router.get('/getProducts', product.getProducts)

    router.get('/getCategories', product.getCategories)
    router.get('/getProductsByCategoryID/', product.getProductsByCategoryID)
    router.get('/getSubCategoryByCategoryId/', product.getSubCategoryByCategoryId)

    router.get('/getSubCategories', product.getSubCategories)
    router.get('/getProductsBySubCategoryID', product.getProductsBySubCategoryID)
    

    app.use(config.baseApiUrl, router);
}