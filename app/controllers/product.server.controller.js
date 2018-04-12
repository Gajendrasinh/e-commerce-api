var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

var { Product, Category, productType } = require('../models/product.server.model');
//////////////////////////////////////////////     ADD APIS ////////////////////////////////////
exports.addProduct = (req, res, next) => {
    var product = new Product(req.body);
    product.save().then(data => {
        return res.send({
            message: "hello",
            data: data
        })
    }).catch(err => { next(err) })
}
exports.addCategory = (req, res, next) => {
    var product = new Category(req.body);
    product.save().then(data => {
        return res.send({
            message: "hello",
            data: data
        })
    }).catch(err => { next(err) })
}
exports.AddProductType = (req, res, next) => {
    var product = new productType(req.body);
    product.save().then(data => {
        return res.send({
            message: "hello",
            data: data
        })
    }).catch(err => { next(err) })
}

//////////////////////////////////////////////     UPDATE APIS ////////////////////////////////////
exports.updateProduct = (req, res, next) => {
    var { ids } = req.body;
    Product.update({ _id: { $in: ids } }, { $set: req.body }).then(data => {
        res.send(sendSuccess(data, "data updated SuccessFully"));
    }).catch(err => next(err))
}
exports.updateCategory = (req, res, next) => {
    var { ids } = req.body;
    Category.update({ _id: { $in: ids } }, { $set: req.body }).then(data => {
        res.send(sendSuccess(data, "data updated SuccessFully"));
    }).catch(err => next(err))
}
exports.updateProductType = (req, res, next) => {
    var { ids } = req.body;
    productType.update({ _id: { $in: ids } }, { $set: req.body }).then(data => {
        res.send(sendSuccess(data, "data updated SuccessFully"));
    }).catch(err => next(err))
}
//////////////////////////////////////////////     DELETE APIS ////////////////////////////////////
exports.deleteProduct = (req, res, next) => {
    var { ids } = req.body;
    productType.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}
exports.deleteCategory = (req, res, next) => {
    var { ids } = req.body;
    productType.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}
exports.deleteProductType = (req, res, next) => {
    var { ids } = req.body;
    productType.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}

////////////////////////////////////////////// GET APIS //////////////////////////////////// 


exports.getProductByID = (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getProducts = (req, res, next) => {
    Product.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}

exports.getProductsByCategoryID = (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}

exports.getCategories = (req, res, next) => {
    Product.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getProductTypeByID = (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getProductTypes = (req, res, next) => {
    Product.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getCategotyByProductTypeID = (req, res, next) => {
    Product.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}