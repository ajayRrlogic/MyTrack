'use strict';

//Geofences service used to communicate Geofences REST endpoints
angular.module('geofences').factory('Geofences', ['$resource',
	function($resource) {
		return $resource('geofences/:geofenceId', { geofenceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
