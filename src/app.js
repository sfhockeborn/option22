'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('winston');
const expressSession = require('express-session');
const mongoose = require('mongoose');
// TODO get the CORS stuff going

const security = require('./middleware/security');
const routes = require('./routes/routes');

const PORT = 3000;
const app = express();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/option22';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
	secret: process.env.MY_SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(security());

app.use('/', routes.index);
app.use('/auth', routes.auth);

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri);
/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.listen(PORT, () => {
	logger.info(`App listening on port ${PORT}...`);
});
