'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Myfile = mongoose.model('Myfile'),
	_ = require('lodash'),
	fs = require('fs');

/**
 * Create a Myfile
 */
exports.create = function(req, res) {
	var myfile = new Myfile(req.body);
	myfile.user = req.user;

	myfile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(myfile);
		}
	});
};
/**
* Upload MyFile
*/
exports.upload = function(req, res) {
	var file = req.files.file;
	console.log(file.name);
	console.log(file.type);
	console.log(file.path);
	console.log(__dirname);
	fs.rename(file.path, 'public/' + file.name, function(err) {if (err) throw err; console.log('Moved!');});
//	fs.readFile(file.path, function(err, original_data){
//		if (err) throw err;
//		fs.writeFile('../../public/' + file.name, original_data, function(err) {
//			if (err) throw err;
//			console.log('It\'s saved!');
//			}
//		);
//	});
};


/**
 * Show the current Myfile
 */
exports.read = function(req, res) {
	res.jsonp(req.myfile);
};

/**
 * Update a Myfile
 */
exports.update = function(req, res) {
	var myfile = req.myfile ;

	myfile = _.extend(myfile , req.body);

	myfile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(myfile);
		}
	});
};

/**
 * Delete an Myfile
 */
exports.delete = function(req, res) {
	var myfile = req.myfile ;

	myfile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(myfile);
		}
	});
};

/**
 * List of Myfiles
 */
exports.list = function(req, res) { 
	Myfile.find().sort('-created').populate('user', 'displayName').exec(function(err, myfiles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(myfiles);
		}
	});
};

/**
 * Myfile middleware
 */
exports.myfileByID = function(req, res, next, id) { 
	Myfile.findById(id).populate('user', 'displayName').exec(function(err, myfile) {
		if (err) return next(err);
		if (! myfile) return next(new Error('Failed to load Myfile ' + id));
		req.myfile = myfile ;
		next();
	});
};

/**
 * Myfile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.myfile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
