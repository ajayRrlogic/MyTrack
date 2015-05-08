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

angular.module('geofences').factory('GeoFencesService', function(){

  /*
  geoFenceObject = {
    name:'name of geofence',
    vertices:[]
       latlong.lat
       latlong.lng
}
  */
  var geoFencesObject = {};

  geoFencesObject.list = [];

	geoFencesObject.add = function(oneGeoFence){
		geoFencesObject.list.push({id: geoFencesObject.list.length, oneGeo: oneGeoFence});
  };

  return geoFencesObject;
});
