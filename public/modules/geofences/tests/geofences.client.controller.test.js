'use strict';

(function() {
	// Geofences Controller Spec
	describe('Geofences Controller Tests', function() {
		// Initialize global variables
		var GeofencesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Geofences controller.
			GeofencesController = $controller('GeofencesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Geofence object fetched from XHR', inject(function(Geofences) {
			// Create sample Geofence using the Geofences service
			var sampleGeofence = new Geofences({
				name: 'New Geofence'
			});

			// Create a sample Geofences array that includes the new Geofence
			var sampleGeofences = [sampleGeofence];

			// Set GET response
			$httpBackend.expectGET('geofences').respond(sampleGeofences);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.geofences).toEqualData(sampleGeofences);
		}));

		it('$scope.findOne() should create an array with one Geofence object fetched from XHR using a geofenceId URL parameter', inject(function(Geofences) {
			// Define a sample Geofence object
			var sampleGeofence = new Geofences({
				name: 'New Geofence'
			});

			// Set the URL parameter
			$stateParams.geofenceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/geofences\/([0-9a-fA-F]{24})$/).respond(sampleGeofence);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.geofence).toEqualData(sampleGeofence);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Geofences) {
			// Create a sample Geofence object
			var sampleGeofencePostData = new Geofences({
				name: 'New Geofence'
			});

			// Create a sample Geofence response
			var sampleGeofenceResponse = new Geofences({
				_id: '525cf20451979dea2c000001',
				name: 'New Geofence'
			});

			// Fixture mock form input values
			scope.name = 'New Geofence';

			// Set POST response
			$httpBackend.expectPOST('geofences', sampleGeofencePostData).respond(sampleGeofenceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Geofence was created
			expect($location.path()).toBe('/geofences/' + sampleGeofenceResponse._id);
		}));

		it('$scope.update() should update a valid Geofence', inject(function(Geofences) {
			// Define a sample Geofence put data
			var sampleGeofencePutData = new Geofences({
				_id: '525cf20451979dea2c000001',
				name: 'New Geofence'
			});

			// Mock Geofence in scope
			scope.geofence = sampleGeofencePutData;

			// Set PUT response
			$httpBackend.expectPUT(/geofences\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/geofences/' + sampleGeofencePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid geofenceId and remove the Geofence from the scope', inject(function(Geofences) {
			// Create new Geofence object
			var sampleGeofence = new Geofences({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Geofences array and include the Geofence
			scope.geofences = [sampleGeofence];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/geofences\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGeofence);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.geofences.length).toBe(0);
		}));
	});
}());