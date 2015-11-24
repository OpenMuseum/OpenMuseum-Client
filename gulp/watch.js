'use strict';

var browserSync = require('browser-sync'),
    conf = require('./conf'),
    gulp = require('gulp'),
    path = require('path');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {
    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

    gulp.watch([
        path.join(conf.paths.src, '/assets/styles/**/*.pcss')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('styles');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function (event) {
        if (isOnlyChange(event)) {
            gulp.start('scripts');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function (event) {
        browserSync.reload(event.path);
    });
});
