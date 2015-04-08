var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var del = require('del');
var react = require('gulp-react');
var handleErrors = require('../util/handleErrors');

var paths = {
  html: ['src/html/**/*.html'],
  scripts: ['src/js/**/*.js'],
  libraries: ['bower_components/**/*.js']
};

gulp.task('clean', function (cb) {
  del(['build/**/*'], cb);
});

gulp.task('connect', function () {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('html', function () {
  del(['build/**/*.html']);
  gulp.src(paths.html)
      .on('error', handleErrors)
      .pipe(gulp.dest('build'))
      .pipe(connect.reload());
});

gulp.task('scripts', function () {
  del(['build/**/*.js']);
  gulp.src(paths.scripts)
      .on('error', handleErrors)
      .pipe(react())
      .pipe(gulp.dest('build/js'))
      .pipe(connect.reload());
});

gulp.task('build', ['clean', 'html', 'scripts'], function () {
  gulp.src(paths.libraries)
      .on('error', handleErrors)
      .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['build', 'connect', 'watch']);