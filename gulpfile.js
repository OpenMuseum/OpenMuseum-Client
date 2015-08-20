var gulp = require('gulp');
var bower = require('gulp-bower');
var clean = require('gulp-clean');

gulp.task('clean-libs', function() {
    return gulp
        .src('src/lib/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('bower', ['clean-libs'], function() {
    return bower()
        .pipe(gulp.dest('src/lib'));
});

gulp.task('install-libs', ['bower']);

gulp.task('default', ['install-libs']);
