'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var Server = require('karma').Server;

var pathSrcHtml = [
    path.join(conf.paths.src, '/**/*.html')
];

var pathSrcJs = [
    path.join(conf.paths.src, '/**/!(*.spec).js')
];

function runTests(singleRun, done) {
    var localConfig;
    var preprocessors = {};
    var reporters = ['progress'];
    var server;

    pathSrcHtml.forEach(function (path) {
        preprocessors[path] = ['ng-html2js'];
    });

    if (singleRun) {
        pathSrcJs.forEach(function (path) {
            preprocessors[path] = ['coverage'];
        });
        reporters.push('coverage')
    }

    localConfig = {
        configFile: path.join(__dirname, '/../karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        preprocessors: preprocessors
    };

    server = new Server(localConfig, function (exitCode) {
        done(exitCode ? new Error('Karma has exited with ' + exitCode) : null);
    });

    server.start();
}

gulp.task('test', ['scripts'], function (done) {
    runTests(true, done);
});

gulp.task('test:auto', ['watch'], function (done) {
    runTests(false, done);
});
