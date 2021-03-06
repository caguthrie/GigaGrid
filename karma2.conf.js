// Karma configuration
// Generated on Mon Dec 21 2015 16:09:58 GMT-0500 (Eastern Standard Time)

var webpackConfig = require("./webpack.common.js");
delete webpackConfig.entry; // no need for entry, test files are the entry points

module.exports = function (config) {
    config.set({

        frameworks: ['jasmine'],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // list of files / patterns to load in the browser
        files: [
            'test/**/*.spec.ts',
            'test/**/*.spec.tsx'
        ],

        // list of files to exclude
        exclude: [],

        jspm: {
            // Edit this to your needs
            loadFiles: ['build/test/**/*.js'],
            serveFiles: ['build/src/**/*.js']
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // add webpack as preprocessor
            'test/**/*.spec.ts': ['webpack'],
            'test/**/*.spec.tsx': ['webpack']
        },

        webpack: webpackConfig,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        browserNoActivityTimeout: 600000,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
