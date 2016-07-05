'use strict';

var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var shell = require('gulp-shell');

var DEST = './public';

gulp.task('clean', function() {
  del(['./public/*', '!./public/index.html']);
});

gulp.task('js', function() {
  browserify('./src/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(DEST));
});

gulp.task('css', function() {
  gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DEST));
});

gulp.task('html', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest(DEST));
});

gulp.task('build', ['clean', 'js', 'css', 'html']);

gulp.task('server', shell.task('node server.js'));

gulp.task('watch', function() {
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/scss/*.scss', ['css']);
  gulp.watch('./src/index.html', ['html']);
});

gulp.task('default', ['build', 'server', 'watch']);