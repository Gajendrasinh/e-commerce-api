var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

var { Product, Category, productType } = require('../models/product.server.model');

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