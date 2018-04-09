var globalMethods = require('./../../configs/globals');
var config = require('./../../configs/configs');

module.exports = function(app,express){
    var router = express.Router();
    var userRating = require('../controllers/userRating.server.controller');

    router.post('/userRatingList', globalMethods.checkAuth, userRating.userRatingListing);
    router.post('/editUserRating', globalMethods.checkAuth, userRating.editUserRating);
    router.post('/deleteUserRating', globalMethods.checkAuth, userRating.deleteUserRating);
    router.post('/deleteUserRatings', globalMethods.checkAuth, userRating.deleteUserRatings);
    router.post('/approveUserRating', globalMethods.checkAuth, userRating.approveUserRating);
    router.post('/rejectUserRating', globalMethods.checkAuth, userRating.rejectUserRating);


    app.use(config.baseApiUrl, router);

    


}