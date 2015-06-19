'use strict';

module.exports = {
	app: {
		title: 'davidjonesguru',
		description: 'private video server',
		keywords: 'meanjs video'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-file-upload/ng-file-upload.js'
	//			'public/lib/videogular/videogular.js',
	//			'public/lib/videogular-controls/vg-controls.js',
	//			'public/lib/videogular-overlay-play/vg-overlay-play.js',
	//			'public/lib/videogular-poster/vg-poster.js',
	//			'public/lib/videogular-buffering/vg-buffering.js'
			]
		},
		css: [
		'public/modules/**/css/*.css'
       //                 'public/**/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
