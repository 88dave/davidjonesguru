'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Myfile = mongoose.model('Myfile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, myfile;

/**
 * Myfile routes tests
 */
describe('Myfile CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Myfile
		user.save(function() {
			myfile = {
				name: 'Myfile Name'
			};

			done();
		});
	});

	it('should be able to save Myfile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Myfile
				agent.post('/myfiles')
					.send(myfile)
					.expect(200)
					.end(function(myfileSaveErr, myfileSaveRes) {
						// Handle Myfile save error
						if (myfileSaveErr) done(myfileSaveErr);

						// Get a list of Myfiles
						agent.get('/myfiles')
							.end(function(myfilesGetErr, myfilesGetRes) {
								// Handle Myfile save error
								if (myfilesGetErr) done(myfilesGetErr);

								// Get Myfiles list
								var myfiles = myfilesGetRes.body;

								// Set assertions
								(myfiles[0].user._id).should.equal(userId);
								(myfiles[0].name).should.match('Myfile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Myfile instance if not logged in', function(done) {
		agent.post('/myfiles')
			.send(myfile)
			.expect(401)
			.end(function(myfileSaveErr, myfileSaveRes) {
				// Call the assertion callback
				done(myfileSaveErr);
			});
	});

	it('should not be able to save Myfile instance if no name is provided', function(done) {
		// Invalidate name field
		myfile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Myfile
				agent.post('/myfiles')
					.send(myfile)
					.expect(400)
					.end(function(myfileSaveErr, myfileSaveRes) {
						// Set message assertion
						(myfileSaveRes.body.message).should.match('Please fill Myfile name');
						
						// Handle Myfile save error
						done(myfileSaveErr);
					});
			});
	});

	it('should be able to update Myfile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Myfile
				agent.post('/myfiles')
					.send(myfile)
					.expect(200)
					.end(function(myfileSaveErr, myfileSaveRes) {
						// Handle Myfile save error
						if (myfileSaveErr) done(myfileSaveErr);

						// Update Myfile name
						myfile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Myfile
						agent.put('/myfiles/' + myfileSaveRes.body._id)
							.send(myfile)
							.expect(200)
							.end(function(myfileUpdateErr, myfileUpdateRes) {
								// Handle Myfile update error
								if (myfileUpdateErr) done(myfileUpdateErr);

								// Set assertions
								(myfileUpdateRes.body._id).should.equal(myfileSaveRes.body._id);
								(myfileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Myfiles if not signed in', function(done) {
		// Create new Myfile model instance
		var myfileObj = new Myfile(myfile);

		// Save the Myfile
		myfileObj.save(function() {
			// Request Myfiles
			request(app).get('/myfiles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Myfile if not signed in', function(done) {
		// Create new Myfile model instance
		var myfileObj = new Myfile(myfile);

		// Save the Myfile
		myfileObj.save(function() {
			request(app).get('/myfiles/' + myfileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', myfile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Myfile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Myfile
				agent.post('/myfiles')
					.send(myfile)
					.expect(200)
					.end(function(myfileSaveErr, myfileSaveRes) {
						// Handle Myfile save error
						if (myfileSaveErr) done(myfileSaveErr);

						// Delete existing Myfile
						agent.delete('/myfiles/' + myfileSaveRes.body._id)
							.send(myfile)
							.expect(200)
							.end(function(myfileDeleteErr, myfileDeleteRes) {
								// Handle Myfile error error
								if (myfileDeleteErr) done(myfileDeleteErr);

								// Set assertions
								(myfileDeleteRes.body._id).should.equal(myfileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Myfile instance if not signed in', function(done) {
		// Set Myfile user 
		myfile.user = user;

		// Create new Myfile model instance
		var myfileObj = new Myfile(myfile);

		// Save the Myfile
		myfileObj.save(function() {
			// Try deleting Myfile
			request(app).delete('/myfiles/' + myfileObj._id)
			.expect(401)
			.end(function(myfileDeleteErr, myfileDeleteRes) {
				// Set message assertion
				(myfileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Myfile error error
				done(myfileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Myfile.remove().exec();
		done();
	});
});