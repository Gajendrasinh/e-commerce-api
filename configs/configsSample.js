// module.exports = require('./env/' + process.env.NODE_ENV + '.js');

module.exports = {
	db: 'mongodb://admin:admin@ds237489.mlab.com:37489/erp',
	mongoDBOptions: {
		// sets how many times to try reconnecting
		reconnectTries: Number.MAX_VALUE,
		// sets the delay between every retry (milliseconds)
		reconnectInterval: 1000,
		keepAlive: 1,
		connectTimeoutMS: 30000,
		native_parser: true,
		//db: { native_parser: true },
		poolSize: 5,
		//server: { poolSize: 5 },
		useMongoClient: true,
		//user: 'indianic',
		//pass: 'indianic@123'
	},
	CONSOLELOGFLAG: true, // custom console.log 
	sessionSecret: 'indNIC2305',
	securityToken: 'indNIC2305',
	baseApiUrl: '/api',
	serverPort: '8888',
	tokenExpiry: 361440, // Note: in seconds! (1 day)
	rootURL: "http://10.2.1.49:8888/",
	pageName: "main/home",
	adminEmails: 'chandrakanta@indianic.com,chandrakanta1@indianic.com,chandrakanta2@indianic.com',
	adminAccess: ['/login', '/forgotPassword', '/resetPassword', '/profile', '/editProfile']
};

/*use equisiteDB_dev
db.createUser({user: "indianic",pwd: "indianic@123", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]})*/
