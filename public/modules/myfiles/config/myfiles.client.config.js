'use strict';

// Configuring the Articles module
angular.module('myfiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Myfiles', 'myfiles', 'dropdown', '/myfiles(/create)?');
		Menus.addSubMenuItem('topbar', 'myfiles', 'List Myfiles', 'myfiles');
		Menus.addSubMenuItem('topbar', 'myfiles', 'New Myfile', 'myfiles/create');
	}
]);