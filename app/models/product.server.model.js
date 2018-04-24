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
    catagory_id: { type: Schema.Types.ObjectId, ref: 'category' },
    sub_catagory_id: { type: Schema.Types.ObjectId, ref: 'sub_category' },
});
var CategorySchema = new Schema({
    categoryName: { type: String, required: true, unique: true },
    categoryDesc: { type: String, default: "" },
    deleteStatus: { type: Boolean, defalut: false },
});
var SubCategorySchema = new Schema({
    category_id: { type: String, required: true, unique: true },
    SubCategoryName: { type: String, required: true, unique: true },
    SubCategoryDesc: { type: String, default: "" },
    deleteStatus: { type: Boolean, defalut: false },
});
var productModel = mongoose.model('product', productSchema);
var category = mongoose.model('category', CategorySchema);
var subCategory = mongoose.model('sub_category', SubCategorySchema);

module.exports = {
    Product: productModel,
    Category: category,
    SubCategory: subCategory
}