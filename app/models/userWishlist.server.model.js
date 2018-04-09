var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userWishlistSchema = new schema({
    pid:{ type: Schema.Types.ObjectId, ref:'products'},
    uid:{ type:Schema.Types.ObjectId, ref: 'users'},
    status:{type:Boolean, default: true},
    deleteStatus:{type:String, default:false}
},
{
    timestamps:true
});

var wishlistModel = mongoose.Model('userwishlist', userWishlistSchema);
module.exports = {
    'UserWishlist': wishlistModel
}