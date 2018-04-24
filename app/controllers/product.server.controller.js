var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

var { Product, Category, SubCategory } = require('../models/product.server.model');
//////////////////////////////////////////////     ADD APIS ////////////////////////////////////
exports.addCategory = (req, res, next) => {
    var product = new Category(req.body);
    product.save().then(data => {
        return res.send({
            message: "Category Added SuccessFully",
            data: data
        })
    }).catch(err => { next(err) })
}
exports.AddSubCategory = (req, res, next) => {
    var product = new SubCategory(req.body);
    product.save().then(data => {
        return res.send({
            message: "Product Type Added SuccessFully",
            data: data
        })
    }).catch(err => { next(err) })
}
exports.addProduct = (req, res, next) => {
    var product = new Product(req.body);
    product.save().then(data => {
        return res.send({
            message: "Product Added SuccessFully",
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
exports.updateSubCategory = (req, res, next) => {
    var { ids } = req.body;
    SubCategory.update({ _id: { $in: ids } }, { $set: req.body }).then(data => {
        res.send(sendSuccess(data, "data updated SuccessFully"));
    }).catch(err => next(err))
}
//////////////////////////////////////////////     DELETE APIS ////////////////////////////////////
exports.deleteProduct = (req, res, next) => {
    var { ids } = req.body;
    Product.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}
exports.deleteCategory = (req, res, next) => {
    var { ids } = req.body;
    Category.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}
exports.deleteSubCategory = (req, res, next) => {
    var { ids } = req.body;
    SubCategory.remove({ _id: { $in: ids } }).then(data => {
        res.send(sendSuccess(data, "data Deleted SuccessFully"));
    }).catch(err => next(err))
}

////////////////////////////////////////////// GET APIS //////////////////////////////////// 


exports.getProductByID = (req, res, next) => {
    Product.findOne({ _id: req.query.product_id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getProducts = (req, res, next) => {
    Product.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}

exports.getProductsByCategoryID = (req, res, next) => {
    Product.find({ catagory_id: req.query.category_id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}

exports.getCategories = (req, res, next) => {
    Category.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getSubCategoryByCategoryId = (req, res, next) => {
    SubCategory.find({ category_id: req.query.category_id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getSubCategories = (req, res, next) => {
    SubCategory.find().then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}
exports.getProductsBySubCategoryID = (req, res, next) => {
    Product.find({ sub_category_id: req.query.sub_category_id }).then(data => {
        res.send(sendSuccess(data, "data retrived SuccessFully"));
    }).catch(err => next(err))
}