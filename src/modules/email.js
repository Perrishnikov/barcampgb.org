var nodemailer = require('nodemailer');
var config = require('../config.js').email;
var transport;

if (!config.user || !config.password) {
	console.error('Email error: no username or password.');
}

transport = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: config.user,
        pass: config.password
    }
});

module.exports = transport;