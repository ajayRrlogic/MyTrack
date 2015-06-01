'use strict';

// Geofences controller
var app = angular.module('geofences');


app.controller('GeofencesController',['$scope', '$stateParams', '$location', 'Authentication','Geofences',function($scope, $stateParams, $location, Authentication, Geofences) {
	$scope.authentication = Authentication;

	$scope.geoFenceTobeUpdated = {};

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
		console.log('original update called');

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
		console.log('find one called' +$scope.geofence);
		console.log($scope.geoFenceTobeUpdated);
		$scope.geofence = Geofences.get({

			geofenceId: $scope.geoFenceTobeUpdated._id
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

/*
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



*/

//this list is for list of geofences saved in the database
geoFencesObject.list = [];

//this list is for list of geofences to be saved in the database

geoFencesObject.toBeSavedList = [];


geoFencesObject.add = function(oneGeoFence){
	geoFencesObject.toBeSavedList.push(oneGeoFence);
};

return geoFencesObject;
});

//GeoFencesService - local service to store data between controllers
//Geofences - remote service to store to the database


app.controller('mapCtrl',function($compile,$scope,uiGmapGoogleMapApi,Authentication,GeoFencesService,Geofences)
{
	$scope.authentication = Authentication;
	$scope.markersAndCircleFlag = true;
	$scope.drawingManagerControl = {};

	$scope.geoFenceTobeUpdated = {};



	$scope.polygons = GeoFencesService.list;
	//  $scope.poygonEvents = GeoFencesService.polygonEvents;




	uiGmapGoogleMapApi.then(function(maps) {
		$scope.googleVersion = maps.version;
		$scope.infoWindow = new maps.InfoWindow();
		$scope.map = { center: { latitude:12.957251, longitude: 77.701163 },
		zoom:14
	};




	/*info window for polygon*/
	//events for polygon
	$scope.poygonEvents = {
		click:function(polygon,eventName,polyresource,args)
		{
			console.log('clicked inside the polygon');
			console.log(polygon);
			console.log(polyresource);
			console.log(args[0]);
			console.log(eventName);

			var e = args[0];
			var lat = e.latLng.lat(),
			lon = e.latLng.lng();


			$scope.$apply(function () {
				$scope.geoFenceTobeUpdated = polyresource;
			});

			//////////////////////

			var content = '<section data-ng-controller="templateCtrl" data-ng-init="findOne()">' +
			'<div class="col-md-12">'+
			'<form class="form-horizontal" data-ng-submit="update()" novalidate>'+
			'<fieldset>'+
			'<div class="form-group">'+
			'<label class="control-label" for="name">Name</label>'+
			'<div class="controls">'+
			'<input type="text" data-ng-model="geofence.name" id="name" class="form-control" placeholder="Name" required>'+
			'</div>'+
			'</div>'+
			'<div class="form-group">'+
			'<input type="submit" value="Update" class="btn btn-success">'+
			'<a class="btn btn-danger" ng-click="remove(item)">Delete</a>'+
			'</div>'+
			'<div data-ng-show="error" class="text-danger">'+
			'<strong data-ng-bind="error"></strong>'+
			'</div>'+
			'</fieldset>'+
			'</form>'+
			'</div>'+
			'</section>';




			/////////////////////////
			/*
			var content = '<form> '+
			'Name:<br> ' +
			'<input type="text" name="firstname">'+
			'<br> '+
			'Last name:<br>'+
			'<input type="text" name="lastname">' +
			'</form>' +

			'<p>Note that the form itself is not visible.</p>' +

			'<p>Also note that the default width of a text field is 20 characters.</p>';
			*/
			var compiled = $compile(content)($scope);
			$scope.infoWindow.setContent(compiled[0]);
			console.log( e.latLng);
			// 'laty,lngy' is the location of one point in PGpoints, which can be chosen as you wish
			$scope.infoWindow.setPosition(e.latLng);
			$scope.infoWindow.open(polygon.map);

		}

	};


	/*info window for ploygon ends */


	$scope.drawingManagerOptions = {
		drawingMode: null,
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
	overlaycomplete: function (dm, name, scope, objs) {
		var geoFence = {};
		geoFence.state = 0;
		geoFence.loc = {};
		geoFence.loc.type = 'Polygon';

		console.log('overlay complete');

		console.log(dm);

		console.log(name);

		console.log(scope);
		for(var i = 0;i<objs.length;i++)
		{
			console.log(objs[i]);

		}

		geoFence.stroke = {
			color: '#6060FB',
			weight: 3
		};

		geoFence.editable = true;
		geoFence.draggable = true;
		geoFence.geodesic = false;
		geoFence.visible = true;
		//set the name of the geofence with the current date and time
		var d = new Date();
		geoFence.name = d.toUTCString();


		//if it is not polygon no need to add this
		if(dm.drawingMode !== google.maps.drawing.OverlayType.POLYGON)
		{
			return;
		}

		console.log('You successfully placed a %s', dm.drawingMode);


		var shape = objs[0];


		var path = shape.overlay.getPath();
		geoFence.shape = shape.overlay;
		//		geoFence.shape.setMap(null);
		//	geoFence.map = scope.map;
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
		var latlng = [];
		latlng[0] = path.getAt(0).lat();
		latlng[1] = path.getAt(0).lng();

		geoFence.loc.coordinates.push(cordarray);

		$scope.infoWindow.setPosition(path.getAt(0));
		$scope.infoWindow.setContent('ddfffd');
		$scope.infoWindow.open(scope.map);




		GeoFencesService.add(geoFence);





	}
};

});





app.controller('templateCtrl',function($state,$stateParams,$scope,$location,Authentication,GeoFencesService,Geofences){

	$scope.authentication = Authentication;

	//ngclick defs
	$scope.saveGeofences = function(){

		//print the geofences to be saved
		var geoFenceArray = GeoFencesService.toBeSavedList;

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


		GeoFencesService.toBeSavedList.length = 0;
		//check the state field in the geofences array and call appropriate service
		$scope.refresh();


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
			$location.path('geofences');

		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			console.log('error:' + errorResponse.data.message);
		});
	};

	// Find existing Geofence
	$scope.findOne = function() {
		console.log('find one of tetmplate called' +$scope.geoFenceTobeUpdated);
		console.log($scope.geoFenceTobeUpdated._id);
		$scope.geofence = Geofences.get({

			geofenceId: $scope.geoFenceTobeUpdated._id
		});
	};


	// Find a list of Geofences
	$scope.find = function() {
		$scope.geofences = Geofences.query();
		$scope.geofences.$promise.then(function(data){
			GeoFencesService.list.length = 0;
			console.log(data);
			//	GeoFencesService.list.length = 0;
			//fill the array
			for(var i =0; i<data.length; i++)
			{
				console.log(data[i]);
				var geoFence = data[i];
				geoFence.state = 1;

				geoFence.editable = true;
				geoFence.draggable = true;
				geoFence.geodesic = false;
				geoFence.visible = true;



				GeoFencesService.list.push(geoFence);

			}
		});


	};

	// Update existing Geofence
	$scope.update = function() {
		var geofence = $scope.geofence;
		console.log('update called');
		console.log(geofence);
		geofence.$update(function() {

		//	$location.path('geofences/' + geofence._id);

			$scope.geoFenceTobeUpdated = $scope.geofence;
			$scope.infoWindow.close();
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			if(errorResponse)
			{
				console.log('befoee errr');
				console.log(errorResponse);
			}
		});
	};

	// Remove existing Geofence
	$scope.remove = function(geofence) {
		$scope.infoWindow.close();
		$scope.refresh();
		console.log('remove called');

		if ( geofence ) {
			geofence.$remove();
			geofence.setMap(null);
			for (var i in $scope.geofences) {
				if ($scope.geofences [i] === geofence) {
					$scope.geofences.splice(i, 1);
				}
			}
			$location.path('/geofences');
		} else {
			$scope.geofence.$remove(function() {
				$location.path('/geofences');
			});
		}
	};

	$scope.refresh = function()
	{
		$state.transitionTo($state.current, $stateParams, {
    reload: true,
    inherit: false,
    notify: true
		});
	};



});
