var mongoose = require('mongoose');
var schema = mongoose.Schema;
var crypto = require('crypto');


var userSchema = new schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, required: false },
    username: { type: String, required: true },
    verificationStatus: { type: Boolean, required: true, default: false },
    deleteStatus: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    // address : {type : String, required : false},
    // city : {type : String, required : [false, 'why no city']},
    // state : {type : String, required : false},
    mobile: { type: Number, require: true },
    verificationToken: { type: String }
}, {
        timestamps: true
    });
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password, userSchemaPassword) {
    console.log(password, userSchemaPassword);
    return bcrypt.compareSync(password, userSchemaPassword);
};


var userModel = mongoose.model('User', userSchema);

module.exports = {
    User: userModel
}