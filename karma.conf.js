module.exports = config => {
	config.set({
		frameworks: ['jasmine'],
		files: [
			'dist/client/vendor.js',
			'node_modules/promise-polyfill/promise.min.js',
			'dist/client/application.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'dist/client/application.spec.js'
		],
		browserConsoleLogOptions: {
			level: ''
		},
		port: 8080,
		browsers: ['PhantomJS'],
		autoWatch: false,
		singleRun: true
	});
};
