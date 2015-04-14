var gulp = require('gulp');
var gutil = require('gulp-util');
var series = require('stream-series');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var del = require('del');
var react = require('gulp-react');
var handleErrors = require('gulp-plumber');
var errorHandler = require('../util/handleErrors');
var substituter = require('gulp-substituter');
var config = require('../config');

var paths = {
  html: ['src/html/**/*.html'],
  scripts: ['src/js/**/*.js'],
  style: ['src/style/**/*.css'],
  libraries: [
    'bower_components/underscore/underscore.js',
    'bower_components/react/react-with-addons.js',
    'bower_components/parse/parse.js',
    'bower_components/ParseReact/dist/parse-react.js',
    'bower_components/classnames/index.js',
    'bower_components/semantic-ui/dist/semantic.css',
    'bower_components/semantic-ui/dist/themes/default/assets/fonts/*'
  ]
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

gulp.task('html', ['scripts', 'style', 'libraries'], function () {
  var libSources = gulp.src(['build/libs/**/*.js', 'build/libs/**/*.css'], {read: false});
  var appSources = gulp.src(['build/**/*.js', 'build/**/*.css', '!build/libs/**/*.js', '!build/libs/**/*.css'], {read: false});

  return gulp.src(paths.html)
      .pipe(handleErrors(errorHandler))
      .pipe(inject(series(libSources, appSources), {ignorePath: 'build/'}))
      .pipe(gulp.dest('build'))
      .pipe(connect.reload());
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
      .pipe(handleErrors(errorHandler))
      .pipe(react())
      .pipe(substituter(config.parse))
      .pipe(gulp.dest('build/js'))
      .pipe(connect.reload());
});

gulp.task('style', function () {
  return gulp.src(paths.style)
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest('build/css'))
      .pipe(connect.reload());
});

gulp.task('libraries', function () {
  return gulp.src(paths.libraries, {base: './bower_components'})
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest('build/libs/'));
});

gulp.task('build', function (cb) {
  runSequence(
      'clean',
      'html',
      cb
  );
});

gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.style, ['style']);
  gulp.watch(paths.libraries, ['libraries']);
});

gulp.task('default', ['build', 'connect', 'watch']);
