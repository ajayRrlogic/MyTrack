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
	    list = array of long and lat
			state = 0 - to be create
			      = 1 - no change
						= 2 - to be updated
						= 3 - to be deleted
	}
	  */

		var geoFencesObject = {};
		geoFencesObject.polygons = [
							{
									id: 1,
									loc : {
										type: 'Polygon',
										coordinates: [[[80,15],[76,13],[79,11],[80,15]]]

									},
									path: [
											{
													latitude: 15,
													longitude: 80
											},
											{
													latitude: 13,
													longitude: 76
											},
											{
													latitude: 11,
													longitude: 79
											},
											{
													latitude: 15,
													longitude: 80
											}
									],
									stroke: {
											color: '#6060FB',
											weight: 3
									},
									editable: true,
									draggable: true,
									geodesic: false,
									visible: true,
									fill: {
											color: '#ff0000',
											opacity: 0.8
									}
							}
					];






	  geoFencesObject.list = [];



		geoFencesObject.add = function(oneGeoFence){
			geoFencesObject.list.push(oneGeoFence);
	  };

	  return geoFencesObject;
	});

//GeoFencesService - local service to store data between controllers
//Geofences - remote service to store to the database


app.controller('mapCtrl',function($scope,uiGmapGoogleMapApi,Authentication,GeoFencesService,Geofences)
{
	$scope.authentication = Authentication;
  $scope.markersAndCircleFlag = true;
  $scope.drawingManagerControl = {};


	/****temp code*/////

	$scope.polygons = GeoFencesService.list;



	/*****temp code ends ***/


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

			geoFence.state = 0;

			geoFence.loc = {};

			geoFence.loc.type = 'Polygon';




			geoFence.stroke = {
					color: '#6060FB',
					weight: 3
			};
			geoFence.editable = true;
			geoFence.draggable = true;
			geoFence.geodesic = false;
			geoFence.visible = true;
			geoFence.fill = {
					color: '#ff0000',
					opacity: 0.8
			};

			//set the name of the geofence with the current date and time
			var d = new Date();
			geoFence.name = d.toUTCString();

      console.log('You successfully placed a %s', dm.drawingMode);

      //if it is not polygon no need to add this
      if(dm.drawingMode !== google.maps.drawing.OverlayType.POLYGON)
      {
        return;
      }

      var shape = objs[0];


      var path = shape.overlay.getPath();
			geoFence.shape = shape.overlay;
			geoFence.loc.coordinates = [];
			var i ;
			var cordarray = [];
      for ( i = 0 ; i < path.length ; i++) {
				//lng followed by lat
				cordarray[i]=[];

			//	geoFence.loc.coordinates[i] = [];
			cordarray[i].push(path.getAt(i).lng());
			cordarray[i].push(path.getAt(i).lat());

        console.log(i +':' +path.getAt(i).lat(),path.getAt(i).lng());


     }

		//need to push the first element again

		cordarray[i] = [];
		cordarray[i].push(path.getAt(0).lng());
		cordarray[i].push(path.getAt(0).lat());

		geoFence.loc.coordinates.push(cordarray);




     GeoFencesService.add(geoFence);
       console.log('array lengh '+GeoFencesService.list.length);


     $scope.$apply();

    }
	};

});





app.controller('templateCtrl',function($scope,Authentication,GeoFencesService,Geofences){

	$scope.authentication = Authentication;

	$scope.refreshMap = function(){

		//print the geofences to be saved
    var geoFenceArray = GeoFencesService.list;
		console.log('lenth of the array '+geoFenceArray.length);
		for(var i =0;i <geoFenceArray.length;i++ )
		{

			var geoFenceObject = geoFenceArray[i];

			if(geoFenceObject.state === 0)
			{

				geoFenceObject.shape.setMap(null);//???
			}
			else
			{
				geoFenceObject.shape.setMap(null);

			}
		}
		//clear the array and fill it with data from the database

		//get the list from database
		$scope.find();

	//	$scope.$apply();

		console.log('after updating the scope with gfs');


	};

  //ngclick defs
  $scope.saveGeofences = function(){

    //print the geofences to be saved
    var geoFenceArray = GeoFencesService.list;

    console.log('lenth of the array '+geoFenceArray.length);
		for(var i =0;i <geoFenceArray.length;i++ )
		{

			var geoFenceObject = geoFenceArray[i];

			if(geoFenceObject.state === 0)
			{
				//create a geofence object
			//	Geofences.
				 $scope.create(geoFenceObject);

			}

			console.log(geoFenceObject);
			console.log(geoFenceObject.loc);

		}

		//check the state field in the geofences array and call appropriate service



 };

// Create new Geofence
$scope.create = function(geoFenceObject) {
	// Create new Geofence object
	var geofence = new Geofences ({
		name: geoFenceObject.name,
		loc: geoFenceObject.loc
	});

	// Redirect after save
	geofence.$save(function(response) {
    console.log('saved !!!');
		geoFenceObject.state = 1;
	}, function(errorResponse) {
		$scope.error = errorResponse.data.message;
		console.log('error:' + errorResponse.data.message);
	});
};

// Find a list of Geofences
$scope.find = function() {
	$scope.geofences = Geofences.query();
	$scope.geofences.$promise.then(function(data){
	   console.log(data);
 //fill the array
			for(var i =0; i<data.length; i++)
			{
				console.log(data[i]);
				var geoFence = data[i];
				geoFence.state = 1;
				geoFence.stroke = {
						color: '#6060FB',
						weight: 3
				};
				geoFence.editable = true;
				geoFence.draggable = true;
				geoFence.geodesic = true;
				geoFence.visible = true;


				GeoFencesService.list.push(geoFence);

			}
	});


};




});
