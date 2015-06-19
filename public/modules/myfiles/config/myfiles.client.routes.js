'use strict';

//Setting up route
angular.module('myfiles').config(['$stateProvider',
	function($stateProvider) {
		// Myfiles state routing
		$stateProvider.
		state('listMyfiles', {
			url: '/myfiles',
			templateUrl: 'modules/myfiles/views/list-myfiles.client.view.html'
		}).
		state('createMyfile', {
			url: '/myfiles/create',
			templateUrl: 'modules/myfiles/views/create-myfile.client.view.html'
		}).
		state('viewMyfile', {
			url: '/myfiles/:myfileId',
			templateUrl: 'modules/myfiles/views/view-myfile.client.view.html'
		}).
		state('editMyfile', {
			url: '/myfiles/:myfileId/edit',
			templateUrl: 'modules/myfiles/views/edit-myfile.client.view.html'
		});
	}
]);