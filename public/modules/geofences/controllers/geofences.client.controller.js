'use strict';

// Geofences controller
var app = angular.module('geofences');


app.controller('GeofencesController',['$scope', '$stateParams', '$location', 'Authentication','Geofences',function($scope, $stateParams, $location, Authentication, Geofences) {
		$scope.authentication = Authentication;

		// Create new Geofence
		$scope.create = function() {
			// Create new Geofence object
			var geofence = new Geofences ({
				name: this.name
			});

			// Redirect after save
			geofence.$save(function(response) {
				$location.path('geofences/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Geofence
		$scope.remove = function(geofence) {
			if ( geofence ) {
				geofence.$remove();

				for (var i in $scope.geofences) {
					if ($scope.geofences [i] === geofence) {
						$scope.geofences.splice(i, 1);
					}
				}
			} else {
				$scope.geofence.$remove(function() {
					$location.path('geofences');
				});
			}
		};

		// Update existing Geofence
		$scope.update = function() {
			var geofence = $scope.geofence;

			geofence.$update(function() {
				$location.path('geofences/' + geofence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Geofences
		$scope.find = function() {
			$scope.geofences = Geofences.query();
		};

		// Find existing Geofence
		$scope.findOne = function() {
			$scope.geofence = Geofences.get({
				geofenceId: $stateParams.geofenceId
			});
		};
	}]);


	app.config(function(uiGmapGoogleMapApiProvider) {
	    uiGmapGoogleMapApiProvider.configure({
	           key: 'AIzaSyDy9J9_DFi-O539N0iBIKY37V-hRlDvlj8',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization,drawing'
	    });
	});


	app.factory('GeoFencesService', function(){

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



app.controller('mapCtrl',function($scope,uiGmapGoogleMapApi,GeoFencesService)
{

  $scope.markersAndCircleFlag = true;
  $scope.drawingManagerControl = {};


	uiGmapGoogleMapApi.then(function(maps) {
    $scope.googleVersion = maps.version;

    $scope.map = { center: { latitude:12.957251, longitude: 77.701163 },
    zoom:14
    };


    $scope.drawingManagerOptions = {
    drawingMode: maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: maps.ControlPosition.TOP_CENTER,
        drawingModes: [



          maps.drawing.OverlayType.POLYGON,


        ]
    },
    circleOptions: {
      fillColor: '#ffff00',
        fillOpacity: 0,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      },
      polygonOptions: {
        fillColor: '#ffff00',
          fillOpacity: 0,
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1
        },
        rectangleOptions: {
            fillColor: '#ffff00',
              fillOpacity: 0,
              strokeWeight: 2,
              clickable: false,
              editable: true,
              zIndex: 1
            }
    };

});



	$scope.eventHandler = {
    overlaycomplete: function (dm, name, sce, objs) {
      var geoFence = {};
      geoFence.name = 'geoFenceName';


      console.log('You successfully placed a %s', dm.drawingMode);

      //if it is not polygon no need to add this
      if(dm.drawingMode !== google.maps.drawing.OverlayType.POLYGON)
      {
        return;
      }

      var shape = objs[0];


      var path = shape.overlay.getPath();
      var vertices = [];
      for (var i = 0 ; i < path.length ; i++) {
        var latLong = {};

        latLong.lat = path.getAt(i).lat();
        latLong.long = path.getAt(i).lng();
        console.log(i +':' +path.getAt(i).lat(),path.getAt(i).lng());
        vertices.push(latLong);

     }
     geoFence.vertices = vertices;



     GeoFencesService.add(geoFence);
       console.log('array lengh '+GeoFencesService.list.length);


     $scope.$apply();

    }
	};

});





app.controller('templateCtrl',function($scope,GeoFencesService){

  //ngclick defs
  $scope.saveGeofences = function(){

    //print the geofences to be saved
    var geoFenceArray = GeoFencesService.list;

    console.log('lenth of the array '+geoFenceArray.length);


 };

});
