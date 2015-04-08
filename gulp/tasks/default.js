var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var del = require('del');
var react = require('gulp-react');
var handleErrors = require('gulp-plumber');
var errorHandler = require('../util/handleErrors');

var paths = {
  html: ['src/html/**/*.html'],
  scripts: ['src/js/**/*.js'],
  libraries: [
    'bower_components/react/*.js',
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

gulp.task('html', function () {
  return gulp.src(paths.html)
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest('build'))
      .pipe(connect.reload());
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
      .pipe(handleErrors(errorHandler))
      .pipe(react())
      .pipe(gulp.dest('build/js'))
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
      ['html', 'scripts', 'libraries'],
      cb
  );
});

gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['build', 'connect', 'watch']);