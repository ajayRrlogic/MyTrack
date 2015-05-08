'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var geofences = require('../../app/controllers/geofences.server.controller');

	// Geofences Routes
	app.route('/geofences')
		.get(geofences.list)
		.post(users.requiresLogin, geofences.create);

	app.route('/geofences/:geofenceId')
		.get(geofences.read)
		.put(users.requiresLogin, geofences.hasAuthorization, geofences.update)
		.delete(users.requiresLogin, geofences.hasAuthorization, geofences.delete);

	// Finish by binding the Geofence middleware
	app.param('geofenceId', geofences.geofenceByID);
};
