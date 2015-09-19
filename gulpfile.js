'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
    browserify('./src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public'));
});