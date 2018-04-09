process.env.NODE_ENV = process.env.NODE_ENV || 'development'; /*development, staging, production*/

var exp = require('express');
var config = require('./configs/configs');
var express = require('./configs/express');
var mongoose = require('./configs/mongoose');

if (global.permission) {

} else {
	global.permission = [];
}

var db = mongoose();
var app = express();

/* Old path for serving public folder */
// app.use(exp.static(__dirname + './../public'));
/* To serve the folder (We are using it for images (public/upload), PDF(public/pdf, doc(public/docx) etc. etc.) */
app.use(exp.static(__dirname + '/'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.end("This is the API");
});
// Allowing X-domain request
app.get('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
	next();
});
// used in Promise Functions For Catching Errors
app.use(function (err, req, res, next) {
	console.error(err.stack);
	return res.status(500).send({
		status: 0,
		statusCode: 500,
		message: err.message,
		error: err
	});
});
app.listen(config.serverPort);
console.log('Server running at http://localhost:' + config.serverPort + '/');