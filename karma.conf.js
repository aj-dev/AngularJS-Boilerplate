/* globals module */
module.exports = function (config) {
	'use strict';

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',

		files: [
			'node_modules/angular/angular.min.js',
			'node_modules/angular-route/angular-route.min.js',
			'node_modules/angular-sanitize/angular-sanitize.min.js',
			'node_modules/angular-mocks/angular-mocks.min.js',
			'libs/lodash.min.js',
			'app/**/*.js'
		],

		// frameworks to use
		frameworks: [
			'jasmine'
		],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['coverage'],

		preprocessors: {
			'app/**/*.js': ['coverage']
		},

		coverageReporter: {
			reporters: [
				{
					type: 'lcov',
					dir: 'test/tmp/coverage',
					subdir: function (browser) {
						return browser.toLowerCase().split(/[ /-]/)[0];
					}
				},
				{
					type: 'text-summary'
				}
			]
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 30000,

		// Increase timeout to avoid problems in some windows machine when running the tests with phantomjs
		browserNoActivityTimeout: 60000
	});
};
