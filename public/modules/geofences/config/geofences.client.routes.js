'use strict';

//Setting up route

angular.module('geofences').config(['$stateProvider',
	function($stateProvider) {

		// Geofences state routing
		$stateProvider.
		state('listGeofences', {
			url: '/geofences',
			templateUrl: 'modules/geofences/views/list-geofences.client.view.html'
		})
		.
		state('createGeofence', {
			url: '/geofences/create',
			templateUrl: 'modules/geofences/views/list-geofences.client.view.html'
		}).
		state('viewGeofence', {
			url: '/geofences/:geofenceId',
			templateUrl: 'modules/geofences/views/list-geofences.client.view.html'
		}).
		state('editGeofence', {
			url: '/geofences/:geofenceId/edit',
			templateUrl: 'modules/geofences/views/list-geofences.client.view.html'
		})
		;
	}
]);
