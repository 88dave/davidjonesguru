'use strict';
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var myfiles = require('../../app/controllers/myfiles.server.controller');

	// Myfiles Routes
	app.route('/myfiles')
		.get(myfiles.list)
		.post(users.requiresLogin, myfiles.create);

	app.route('/myfiles/:myfileId')
		.get(myfiles.read)
		.put(users.requiresLogin, myfiles.hasAuthorization, myfiles.update)
		.delete(users.requiresLogin, myfiles.hasAuthorization, myfiles.delete);

	app.route('/upload')
		.post(users.requiresLogin, multipartyMiddleware,myfiles.upload);

	// Finish by binding the Myfile middleware
	app.param('myfileId', myfiles.myfileByID);
};
