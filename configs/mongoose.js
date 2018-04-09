config = require('./configs');
mongoose = require('mongoose');
module.exports = function () {
	mongoose.Promise = global.Promise; // DeprecationWarning: Mongoose: mpromise
	var db = mongoose.connect(config.db, config.mongoDBOptions).then(
		(success, err) => {
			console.log('MongoDB connected')
		},
		(err) => {
			console.log('MongoDB connection error : ', err)
		});
	// require('../app/models/userProfile.server.model');
	 require('../app/models/product.server.model');
	

	return db;
};