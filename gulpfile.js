'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var shell = require('gulp-shell');

gulp.task('js', function () {
    browserify('./src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public'));
});

gulp.task('css', function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public'));
});

gulp.task('build', ['js', 'css']);

gulp.task('server', shell.task('node server.js'));

gulp.task('watch', function () {
    gulp.watch('./src/scss/*.scss', ['css']);
    gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('default', ['build', 'server', 'watch']);