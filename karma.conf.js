// Karma configuration
// Generated on Wed Sep 06 2017 20:07:29 GMT+0900 (JST)

module.exports = function(config)
{
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        "basePath": "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        "frameworks": ["jasmine"],

        // list of files / patterns to load in the browser
        "files": [
            "test/test.html",
            "src/languages/src/Language.js",
            "src/languages/src/*.js",
            "src/javascript/Util.replaced.js",
            "src/javascript/encoder/*.js",
            "src/javascript/instance/Instance.js",
            "src/javascript/instance/*.js",
            "src/javascript/filter/Filter.js",
            "src/javascript/filter/*.js",
            "src/javascript/parser/*.js",
            "src/javascript/WorkSpace.js",
            "src/javascript/event/*.js",
            "src/javascript/view/tool/*.js",
            "src/javascript/view/tool/defaultTool/BaseTool.js",
            "src/javascript/view/tool/defaultTool/DrawTool.js",
            "src/javascript/view/tool/defaultTool/*.js",
            "src/javascript/view/controller/BaseController.js",
            "src/javascript/view/controller/GradientFilterController.js",
            "src/javascript/view/**/*.js",
            "src/javascript/view/*.js",
            "src/javascript/external/*.js",
            "test/**/*.js"
        ],

        // list of files / patterns to exclude
        "exclude": [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        "preprocessors": {
            "test/test.html": "html2js"
        },

        "reporters": ["progress"],

        // web server port
        "port": 9876,

        // enable / disable colors in the output (reporters and logs)
        "colors": true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        "logLevel": config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        "autoWatch": true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        "browsers": ["ChromeHeadless", "FirefoxHeadless"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        "singleRun": false,

        // Concurrency level
        // how many browser should be started simultaneous
        "concurrency": Infinity
    });
};
