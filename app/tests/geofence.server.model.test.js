'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Geofence = mongoose.model('Geofence');

/**
 * Globals
 */
var user, geofence;

/**
 * Unit tests
 */
describe('Geofence Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			geofence = new Geofence({
				name: 'Geofence Name',
				loc:{ type: 'Polygon',
    coordinates: [
      [ [ 100.0 , 0.0 ] , [ 101.0 , 0.0 ] , [ 101.0 , 1.0 ] , [ 100.0 , 1.0 ] , [ 100.0 , 0.0 ] ]]
		},
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return geofence.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			geofence.name = '';

			return geofence.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Geofence.remove().exec();
		User.remove().exec();

		done();
	});
});
