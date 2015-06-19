'use strict';

//Myfiles service used to communicate Myfiles REST endpoints
angular.module('myfiles').factory('uploadFiles', ['$http',
	function($http) {
		this.uploadFileToUrl = function(file, uploadURL){
			console.log('called!');
			var fd = new FormData();
			fd.append('file', file);
			$http.post(uploadURL, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.success(function(){
			})
			.error(function(){
			});
		};
	}
]);
