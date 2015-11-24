var gutil = require('gulp-util');

exports.paths = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    e2e: 'e2e'
};

/**
 *  Wiredep is the lib which inject bower dependencies in project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
    exclude: [/\/bootstrap\.js$/],
    directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 *
 *  @params {string} title
 *
 *  @returns {Function}
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
