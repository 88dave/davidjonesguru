'use strict';

// Myfiles controller
angular.module('myfiles').controller('MyfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Myfiles', 'Upload',
	function($scope, $stateParams, $location, Authentication, Myfiles, Upload) {
		$scope.authentication = Authentication;
//		this.config = {
//			sources: [
//				{src: 'Aero Plates.mpg', type: 'video/mpg'}
//			],
//			theme: 'public/lib/videogular-themes-default/videogular.css'
//		};

		$scope.$watch('myfile', function(){
			$scope.upload($scope.myfile);
		});

		// Create new Myfile
		$scope.create = function() {
			// Create new Myfile object
			var myfile = new Myfiles ({
				name: this.name
			});

			// Redirect after save
			myfile.$save(function(response) {
				$location.path('myfiles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Myfile
		$scope.remove = function(myfile) {
			if ( myfile ) { 
				myfile.$remove();

				for (var i in $scope.myfiles) {
					if ($scope.myfiles [i] === myfile) {
						$scope.myfiles.splice(i, 1);
					}
				}
			} else {
				$scope.myfile.$remove(function() {
					$location.path('myfiles');
				});
			}
		};

	        $scope.upload = function (myfile) {
			console.log('Uploading...');
			var files = myfile;
		       if (files && files.length) {
				var i = 0;
				console.log('File Exists!!!!');
		          //  for (var i = 0; i < files.length; i++) {
		                var file = files[i];
                		Upload.upload({
		                    url: '/upload',
                		    fields: {'username': $scope.username},
		                    file: file
                		})
                                .progress(function (evt) {
	                    		var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		                })
				.success(function (data, status, headers, config) {
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        	       		});
           	 	  //  }
		        }
    		};

		// Update existing Myfile
		$scope.update = function() {
			var myfile = $scope.myfile;

			myfile.$update(function() {
				$location.path('myfiles/' + myfile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Myfiles
		$scope.find = function() {
			$scope.myfiles = Myfiles.query();
		};

		// Find existing Myfile
		$scope.findOne = function() {
			$scope.myfile = Myfiles.get({ 
				myfileId: $stateParams.myfileId
			});
		};
	}
]);
