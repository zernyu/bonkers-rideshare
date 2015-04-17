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
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var uglifyify = require('uglifyify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');

var config = require('../config');

var paths = {
  html: 'src/html/index.html',
  scripts: {
    entry: './src/js/app.js'
  },
  style: [
    'src/style/**/*.css',
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

gulp.task('connect', function () {
  connect.server({
    root: paths.build.root,
    livereload: true
  });
});

gulp.task('html', function () {
  var appPaths = [paths.build.root + '/css/**/*.css'];
  if (process.env.environment === 'production') {
    gutil.log(gutil.colors.yellow('Building in Production mode'));
    appPaths.push(paths.build.dist + '/' + paths.build.minified);
  } else {
    gutil.log(gutil.colors.yellow('Building in Development mode'));
    appPaths.push(paths.build.src + '/' + paths.build.out);
  }

  var libSources = gulp.src([paths.build.src + '/libs/**/*.js', paths.build.src + '/libs/**/*.css'], {read: false});
  var appSources = gulp.src(appPaths, {read: false});

  return gulp.src(paths.html)
      .pipe(handleErrors(errorHandler))
      .pipe(inject(series(libSources, appSources), {ignorePath: paths.build.root, addRootSlash: false}))
      .pipe(gulp.dest(paths.build.root))
      .pipe(connect.reload());
});

gulp.task('style', function () {
  return gulp.src(paths.style, {base: './bower_components'})
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest(paths.build.root + '/css'))
      .pipe(connect.reload());
});

gulp.task('watch', ['style'], function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.style, ['style']);

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

gulp.task('clean', function (cb) {
  del([paths.build.dist + '/**/*'], cb);
});

gulp.task('build', ['clean'], function () {
  return browserify({
    entries: [paths.scripts.entry],
    transform: [reactify, uglifyify]
  })
      .bundle()
      .pipe(source(paths.build.minified))
      .pipe(streamify(substituter(config.parse)))
      .pipe(gulp.dest(paths.build.dist));
});

gulp.task('default', function () {
  process.env.environment = 'development';
  sequence('watch', 'html', 'connect');
});

gulp.task('production', function () {
  process.env.environment = 'production';
  sequence('build', 'html');
});
