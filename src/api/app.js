var fs = require('fs');
var express = require('express');
var app = express();
var db = require('./db');
var router = require('./router');
var controllers;

// return error if db not connected
app.use(function(req, res, next) {
	if (db.readyState !== 1 && app.get('env') !== 'development') {
		return res.status(500).json({
			error: 'No database connection.'
		});
	}
	next();
});

db.connect();
controllers = fs.readdirSync(__dirname + '/resources').map(function(dir) {
	var Controller = require('./resources/' + dir);
	return new Controller(db);
});
router.attachRoutes(controllers, app);

module.exports = app;