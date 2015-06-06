'use strict';

// Configuring the Articles module
angular.module('about').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'about', 'about', 'dropdown', true);
		Menus.addSubMenuItem('topbar', 'about', 'AboutMe', 'aboutme', true);
		Menus.addSubMenuItem('topbar', 'about', 'AboutThisWebsite', 'aboutthiswebsite', false);
	//	Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
	//	Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
