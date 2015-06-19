'use strict';

//Myfiles service used to communicate Myfiles REST endpoints
angular.module('myfiles').factory('Myfiles', ['$resource',
	function($resource) {
		return $resource('myfiles/:myfileId', { myfileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);