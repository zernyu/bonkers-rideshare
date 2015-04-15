var gulp = require('gulp');
var gutil = require('gulp-util');
var series = require('stream-series');
var inject = require('gulp-inject');
var sequence = require('run-sequence');
var connect = require('gulp-connect');
var del = require('del');
var handleErrors = require('gulp-plumber');
var errorHandler = require('../util/handleErrors');
var substituter = require('gulp-substituter');

// JS build tools
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');

var config = require('../config');

var paths = {
  html: 'src/html/index.html',
  scripts: {
    entry: './src/js/app.js'
  },
  style: 'src/style/**/*.css',
  libraries: [
    'bower_components/underscore/underscore.js',
    'bower_components/react/react-with-addons.js',
    'bower_components/parse/parse.js',
    'bower_components/ParseReact/dist/parse-react.js',
    'bower_components/classnames/index.js',
    'bower_components/semantic-ui/dist/semantic.css',
    'bower_components/semantic-ui/dist/themes/default/assets/fonts/*'
  ],
  build: {
    out: 'app.js',
    minified: 'app.min.js',
    root: 'dist',
    dist: 'dist/build',
    src: 'dist/src'
  }
};

gulp.task('clean', function (cb) {
  del(['build/**/*'], cb);
});

gulp.task('connect', function () {
  connect.server({
    root: paths.build.root,
    livereload: true
  });
});

gulp.task('html', function () {
  var libSources = gulp.src([paths.build.src + '/libs/**/*.js', paths.build.src + '/libs/**/*.css'], {read: false});
  var appSources = gulp.src([paths.build.src + '/app.js', paths.build.root + '/css/*.css'], {read: false});

  return gulp.src(paths.html)
      .pipe(handleErrors(errorHandler))
      .pipe(inject(series(libSources, appSources), {ignorePath: paths.build.root, addRootSlash: false}))
      .pipe(gulp.dest(paths.build.root))
      .pipe(connect.reload());
});

gulp.task('style', function () {
  return gulp.src(paths.style)
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest(paths.build.root + '/css'))
      .pipe(connect.reload());
});

gulp.task('libraries', function () {
  return gulp.src(paths.libraries, {base: './bower_components'})
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest(paths.build.src + '/libs'));
});

gulp.task('build', function (cb) {
  runSequence(
      'clean',
      'html',
      cb
  );
});

gulp.task('watch', ['style', 'libraries'], function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.style, ['style']);
  gulp.watch(paths.libraries, ['libraries']);

  var watcher = watchify(browserify({
    entries: [paths.scripts.entry],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher
      .on('update', function () {
        var updateStart = Date.now();
        gutil.log(gutil.colors.green('Sources updated. Rebundling javascript') + '...');
        watcher.bundle()
            .pipe(source(paths.build.out))
            .pipe(streamify(substituter(config.parse)))
            .pipe(gulp.dest(paths.build.src))
            .pipe(connect.reload());
        gutil.log(gutil.colors.green('Complete!'), 'after', gutil.colors.magenta((Date.now() - updateStart) + 'ms'));
      })
      .bundle()
      .pipe(source(paths.build.out))
      .pipe(streamify(substituter(config.parse)))
      .pipe(gulp.dest(paths.build.src));
});

gulp.task('build//TODO', function () {
  browserify({
    entries: [paths.scripts.entry],
    transform: [reactify]
  })
      .bundle()
      .pipe(source(paths.build.minified))
      .pipe(substituter(config.parse))
      .pipe(streamify(substituter(config.parse)))
      .pipe(streamify(uglify(paths.build.minified)))
      .pipe(gulp.dest(paths.build.dist));

  // TODO: gulp.task('production', ['replaceHTML', 'build']); where replaceHTML injects the built js path
});

gulp.task('default', function () {
  sequence('watch', 'html', 'connect');
});
