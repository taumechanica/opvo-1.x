module.exports = config => {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'node_modules/promise-polyfill/dist/polyfill.min.js',
            'dist/client/application.spec.js',
            'dist/client/modules/**/*.html'
        ],
        plugins: [
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-phantomjs-launcher'
        ],
        preprocessors: {
            'dist/client/modules/**/*.html': 'ng-html2js'
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'dist/client/modules',
            prependPrefix: '/tpl',
            moduleName: 'opvo.templates'
        },
        browserConsoleLogOptions: {
            level: ''
        },
        port: 8080,
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true
    });
};
