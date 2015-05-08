'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Geofence = mongoose.model('Geofence'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, geofence;

/**
 * Geofence routes tests
 */
describe('Geofence CRUD tests', function() {
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

		// Save a user to the test db and create new Geofence
		user.save(function() {
			geofence = {
				name: 'Geofence Name'
			};

			done();
		});
	});

	it('should be able to save Geofence instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geofence
				agent.post('/geofences')
					.send(geofence)
					.expect(200)
					.end(function(geofenceSaveErr, geofenceSaveRes) {
						// Handle Geofence save error
						if (geofenceSaveErr) done(geofenceSaveErr);

						// Get a list of Geofences
						agent.get('/geofences')
							.end(function(geofencesGetErr, geofencesGetRes) {
								// Handle Geofence save error
								if (geofencesGetErr) done(geofencesGetErr);

								// Get Geofences list
								var geofences = geofencesGetRes.body;

								// Set assertions
								(geofences[0].user._id).should.equal(userId);
								(geofences[0].name).should.match('Geofence Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Geofence instance if not logged in', function(done) {
		agent.post('/geofences')
			.send(geofence)
			.expect(401)
			.end(function(geofenceSaveErr, geofenceSaveRes) {
				// Call the assertion callback
				done(geofenceSaveErr);
			});
	});

	it('should not be able to save Geofence instance if no name is provided', function(done) {
		// Invalidate name field
		geofence.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geofence
				agent.post('/geofences')
					.send(geofence)
					.expect(400)
					.end(function(geofenceSaveErr, geofenceSaveRes) {
						// Set message assertion
						(geofenceSaveRes.body.message).should.match('Please fill Geofence name');
						
						// Handle Geofence save error
						done(geofenceSaveErr);
					});
			});
	});

	it('should be able to update Geofence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geofence
				agent.post('/geofences')
					.send(geofence)
					.expect(200)
					.end(function(geofenceSaveErr, geofenceSaveRes) {
						// Handle Geofence save error
						if (geofenceSaveErr) done(geofenceSaveErr);

						// Update Geofence name
						geofence.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Geofence
						agent.put('/geofences/' + geofenceSaveRes.body._id)
							.send(geofence)
							.expect(200)
							.end(function(geofenceUpdateErr, geofenceUpdateRes) {
								// Handle Geofence update error
								if (geofenceUpdateErr) done(geofenceUpdateErr);

								// Set assertions
								(geofenceUpdateRes.body._id).should.equal(geofenceSaveRes.body._id);
								(geofenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Geofences if not signed in', function(done) {
		// Create new Geofence model instance
		var geofenceObj = new Geofence(geofence);

		// Save the Geofence
		geofenceObj.save(function() {
			// Request Geofences
			request(app).get('/geofences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Geofence if not signed in', function(done) {
		// Create new Geofence model instance
		var geofenceObj = new Geofence(geofence);

		// Save the Geofence
		geofenceObj.save(function() {
			request(app).get('/geofences/' + geofenceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', geofence.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Geofence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geofence
				agent.post('/geofences')
					.send(geofence)
					.expect(200)
					.end(function(geofenceSaveErr, geofenceSaveRes) {
						// Handle Geofence save error
						if (geofenceSaveErr) done(geofenceSaveErr);

						// Delete existing Geofence
						agent.delete('/geofences/' + geofenceSaveRes.body._id)
							.send(geofence)
							.expect(200)
							.end(function(geofenceDeleteErr, geofenceDeleteRes) {
								// Handle Geofence error error
								if (geofenceDeleteErr) done(geofenceDeleteErr);

								// Set assertions
								(geofenceDeleteRes.body._id).should.equal(geofenceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Geofence instance if not signed in', function(done) {
		// Set Geofence user 
		geofence.user = user;

		// Create new Geofence model instance
		var geofenceObj = new Geofence(geofence);

		// Save the Geofence
		geofenceObj.save(function() {
			// Try deleting Geofence
			request(app).delete('/geofences/' + geofenceObj._id)
			.expect(401)
			.end(function(geofenceDeleteErr, geofenceDeleteRes) {
				// Set message assertion
				(geofenceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Geofence error error
				done(geofenceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Geofence.remove().exec();
		done();
	});
});