'use strict';

(function() {
	// Myfiles Controller Spec
	describe('Myfiles Controller Tests', function() {
		// Initialize global variables
		var MyfilesController,
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

			// Initialize the Myfiles controller.
			MyfilesController = $controller('MyfilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Myfile object fetched from XHR', inject(function(Myfiles) {
			// Create sample Myfile using the Myfiles service
			var sampleMyfile = new Myfiles({
				name: 'New Myfile'
			});

			// Create a sample Myfiles array that includes the new Myfile
			var sampleMyfiles = [sampleMyfile];

			// Set GET response
			$httpBackend.expectGET('myfiles').respond(sampleMyfiles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.myfiles).toEqualData(sampleMyfiles);
		}));

		it('$scope.findOne() should create an array with one Myfile object fetched from XHR using a myfileId URL parameter', inject(function(Myfiles) {
			// Define a sample Myfile object
			var sampleMyfile = new Myfiles({
				name: 'New Myfile'
			});

			// Set the URL parameter
			$stateParams.myfileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/myfiles\/([0-9a-fA-F]{24})$/).respond(sampleMyfile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.myfile).toEqualData(sampleMyfile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Myfiles) {
			// Create a sample Myfile object
			var sampleMyfilePostData = new Myfiles({
				name: 'New Myfile'
			});

			// Create a sample Myfile response
			var sampleMyfileResponse = new Myfiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Myfile'
			});

			// Fixture mock form input values
			scope.name = 'New Myfile';

			// Set POST response
			$httpBackend.expectPOST('myfiles', sampleMyfilePostData).respond(sampleMyfileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Myfile was created
			expect($location.path()).toBe('/myfiles/' + sampleMyfileResponse._id);
		}));

		it('$scope.update() should update a valid Myfile', inject(function(Myfiles) {
			// Define a sample Myfile put data
			var sampleMyfilePutData = new Myfiles({
				_id: '525cf20451979dea2c000001',
				name: 'New Myfile'
			});

			// Mock Myfile in scope
			scope.myfile = sampleMyfilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/myfiles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/myfiles/' + sampleMyfilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid myfileId and remove the Myfile from the scope', inject(function(Myfiles) {
			// Create new Myfile object
			var sampleMyfile = new Myfiles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Myfiles array and include the Myfile
			scope.myfiles = [sampleMyfile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/myfiles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMyfile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.myfiles.length).toBe(0);
		}));
	});
}());