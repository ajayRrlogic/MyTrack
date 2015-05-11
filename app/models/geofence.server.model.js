'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Geofence Schema
 */
var GeofenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Geofence name',
		trim: true
	},
  loc: {
			type: Object,
			index: '2dsphere',
			required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Geofence', GeofenceSchema);
