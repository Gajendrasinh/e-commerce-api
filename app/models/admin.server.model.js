var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var AdminSchema = new schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    contactno: { type: Number, required: true },
    password: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    profilePic: { type: String, },
    username: { type: String, required: true }
}, {
        collection: 'admins',
        timestamps: true
    });

AdminSchema.methods.generateHash = function (password) {
    console.log(password, '----------------------------------------------------------------------------')
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

AdminSchema.methods.validPassword = function (password, userSchemaPassword) {
    console.log(password, userSchemaPassword);
    return bcrypt.compareSync(password, userSchemaPassword);
};

var adminModel = mongoose.model('admin', AdminSchema);

module.exports = {
    Admin: adminModel
}