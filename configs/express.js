var express = require('express');
config = require('./configs');
morgan = require('morgan');
compress = require('compression');
bodyParser = require('body-parser');
methodOverride = require('method-override');
session = require('express-session');
jwt = require('jsonwebtoken');
multer = require('multer'); //middleware for handling multipart/form-data
multiparty = require('multiparty'); /*For File Upload*/
cors = require('cors'); //For cross domain error
// crypto = require('crypto');
//CryptoJS = require('node-cryptojs-aes').CryptoJS; //For Encryption and Decryption
fs = require('file-system');
timeout = require('connect-timeout');

upload = multer({dist:'upload/'});

/*var MongoStore = require('connect-mongo')(express);
NOTE : - This is used to strore session variable's value in database.
But this is not working right now because it shows some error. please check it if want to use it.*/

module.exports = function() {
    //console.log('env' + process.env.NODE_ENV)
    var app = express();
    //console.log(__dirname)
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
      app.use(compress({ threshold: 2 }));
    }

    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(bodyParser.json());

    app.use(methodOverride());

    app.use(cors());
    // app.use(morgan('combined')); // Just uncomment this line to show logs.

    // =======   Settings for CORS
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.use(timeout(120000));
    app.use(haltOnTimedout);

    function haltOnTimedout(req, res, next){
      if (!req.timedout) next();
    }

    app.use(session({
      cookie: { maxAge: 30000 },
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret
    }));
    
  
    require('../app/routes/user.server.routes')(app,express);
    require('../app/routes/admin.server.routes')(app, express);
    require('../app/routes/userListing.server.routes')(app, express);
    require('../app/routes/userRating.server.routes')(app, express);
    require('../app/routes/index.server.routes')(app,express);
    require('../app/routes/wishlist.server.routes')(app, express);
    require('../app/routes/cms.server.routes')(app, express);
    require('../app/routes/products.server.routes')(app, express);

    return app;
  };
