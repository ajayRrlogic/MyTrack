'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Geofence = mongoose.model('Geofence'),
	_ = require('lodash');

/**
 * Create a Geofence
 */
exports.create = function(req, res) {
	var geofence = new Geofence(req.body);
	geofence.user = req.user;

	geofence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geofence);
		}
	});
};

/**
 * Show the current Geofence
 */
exports.read = function(req, res) {
	res.jsonp(req.geofence);
};

/**
 * Update a Geofence
 */
exports.update = function(req, res) {
	var geofence = req.geofence ;

	geofence = _.extend(geofence , req.body);

	geofence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geofence);
		}
	});
};

/**
 * Delete an Geofence
 */
exports.delete = function(req, res) {
	var geofence = req.geofence ;

	geofence.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geofence);
		}
	});
};

/**
 * List of Geofences
 */
exports.list = function(req, res) { 
	Geofence.find().sort('-created').populate('user', 'displayName').exec(function(err, geofences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geofences);
		}
	});
};

/**
 * Geofence middleware
 */
exports.geofenceByID = function(req, res, next, id) { 
	Geofence.findById(id).populate('user', 'displayName').exec(function(err, geofence) {
		if (err) return next(err);
		if (! geofence) return next(new Error('Failed to load Geofence ' + id));
		req.geofence = geofence ;
		next();
	});
};

/**
 * Geofence authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.geofence.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
