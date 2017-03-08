module.exports = config => {
	config.set({
		basePath: 'dist/client',
		frameworks: ['jasmine'],
		files: [
			'vendor.js',
			'application.js',
			'application.spec.js'
		],
		port: 8080,
		browsers: ['PhantomJS'],
		autoWatch: false,
		singleRun: true
	});
};
