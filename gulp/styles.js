'use strict';

var browserSync = require('browser-sync'),
    conf = require('./conf'),
    gulp = require('gulp'),
    path = require('path'),
    postcss = require('gulp-postcss'),
    $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    var mapOptions = {
            basePath: path.join(conf.paths.src, '/assets/styles/'),
            maps: ['colors.yml']
        },

        reportOptions = {
            clearMessages: true
        },

        processors = [
            require('postcss-import'),
            require('postcss-cssnext'),
            require('postcss-map')(mapOptions),
            require('precss'),
            require('stylelint'),
            require('postcss-reporter')(reportOptions)
        ],

        injectFiles = gulp.src([
            path.join(conf.paths.src, '/assets/styles/**/*.pcss'),
            path.join('!' + conf.paths.src, '/assets/styles/index.pcss')
        ], {
            read: false
        }),

        injectOptions = {
            transform: function (filePath) {
                filePath = filePath.replace(conf.paths.src + '/assets/styles/', '');
                return '@import \'' + filePath + '\';';
            },
            starttag: '/* injector */',
            endtag: '/* endinjector */',
            addRootSlash: false
        };

    return gulp.src([
            path.join(conf.paths.src, '/assets/styles/index.pcss')
        ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe($.sourcemaps.init())
        .pipe(postcss(processors))
        .pipe($.sourcemaps.write())
        .pipe($.dest(path.join(conf.paths.tmp, '/serve/app/'), {ext: '.css'}))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({stream: true}));
});
