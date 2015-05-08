'use strict';

//Setting up route
angular.module('geofences').config(['$stateProvider',
	function($stateProvider) {
		// Geofences state routing
		$stateProvider.
		state('listGeofences', {
			url: '/geofences',
			templateUrl: 'modules/geofences/views/list-geofences.client.view.html'
		}).
		state('createGeofence', {
			url: '/geofences/create',
			templateUrl: 'modules/geofences/views/create-geofence.client.view.html'
		}).
		state('viewGeofence', {
			url: '/geofences/:geofenceId',
			templateUrl: 'modules/geofences/views/view-geofence.client.view.html'
		}).
		state('editGeofence', {
			url: '/geofences/:geofenceId/edit',
			templateUrl: 'modules/geofences/views/edit-geofence.client.view.html'
		});
	}
]);


angular.module('geofences').config(['uiGmapGoogleMapApiProvider',function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
           key: 'AIzaSyDy9J9_DFi-O539N0iBIKY37V-hRlDvlj8',
        v: '3.17',
        libraries: 'weather,geometry,visualization,drawing'
    });
}]);
