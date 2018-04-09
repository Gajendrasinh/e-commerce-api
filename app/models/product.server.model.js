var mongoose = require('mongoose');
var { Schema } = mongoose;

var productSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'users' },
    available: { type: Boolean, required: true },
    status: { type: Boolean, required: true, defalut: true },
    deleteStatus: { type: Boolean, defalut: false },
    image: { type: String },
    catagory: { type: Schema.Types.ObjectId, ref: 'productCategory' },

});
var CategorySchema = new Schema({
    categoryName: { type: String, required: true, unique: true },
    categoryDesc: { type: String, default: "" },
    deleteStatus: { type: Boolean, defalut: false },
    productType: { type: Schema.Types.ObjectId, ref: 'productType' }
});
var productTypeSchema = new Schema({
    productType: { type: String, required: true, unique: true },
    productTypeDesc: { type: String, default: "" },
    deleteStatus: { type: Boolean, defalut: false },
});
var productModel = mongoose.model('product', productSchema);
var category = mongoose.model('productCategory', CategorySchema);
var productType = mongoose.model('productType', productTypeSchema);

module.exports = {
    Product: productModel,
    Category: category,
    productType: productType
}