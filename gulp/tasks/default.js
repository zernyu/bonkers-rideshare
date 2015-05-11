var gulp = require('gulp');
var gutil = require('gulp-util');
var series = require('stream-series');
var inject = require('gulp-inject');
var sequence = require('run-sequence');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var lrload = require('livereactload');
var del = require('del');
var handleErrors = require('gulp-plumber');
var errorHandler = require('../util/handleErrors');
var substituter = require('gulp-substituter');
var shell = require('gulp-shell');
var flags = require('minimist')(process.argv.slice(2));

// JS build tools
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var uglifyify = require('uglifyify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');

var minifyCSS = require('gulp-minify-css');

var config = require('../config');

var paths = {
  html: 'src/html/index.html',
  scripts: {
    entry: flags.mobile ? './src/js/app-mobile.js' : './src/js/app.js'
  },
  style: {
    app: flags.mobile ? 'src/style/**/*.css' : 'src/style/*.css',
    lib: [
      'bower_components/semantic-ui/dist/semantic.css',
      'bower_components/semantic-ui/dist/themes/default/assets/fonts/*'
    ]
  },
  build: {
    script: {
      development: 'app.js',
      production: 'app.min.js'
    },
    style: {
      production: 'app.min.css'
    },
    development: 'dist/src',
    production: 'dist/build',
    native: 'native/www'
  }
};

gulp.task('connect', function () {
  connect.server({
    root: paths.build[process.env.environment],
    livereload: true
  });
});

gulp.task('html', function () {
  var modes = [flags.mobile ? 'mobile' : 'web'];

  var appPaths;
  if (process.env.environment === 'production') {
    modes.push('production');
    appPaths = [
      paths.build.production + '/' + paths.build.script.production,
      paths.build.production + '/**/*.css'
    ]
  } else {
    modes.push('development');
    appPaths = [
      paths.build.development + '/' + paths.build.script.development,
      paths.build.development + '/style/**/*.css'
    ]
  }

  gutil.log('Building in', gutil.colors.magenta(modes), 'mode.');

  return gulp.src(paths.html)
      .pipe(handleErrors(errorHandler))
      .pipe(inject(gulp.src(appPaths, {read: false}), {
        ignorePath: paths.build[process.env.environment],
        addRootSlash: false
      }))
      .pipe(gulp.dest(paths.build[process.env.environment]))
      .pipe(connect.reload());
});

gulp.task('style', function () {
  var libSources, appSources;

  if (process.env.environment === 'development') {
    libSources = gulp.src(paths.style.lib, {base: './bower_components'});
    appSources = gulp.src(paths.style.app);

    return series(libSources, appSources)
        .pipe(handleErrors(errorHandler))
        .pipe(gulp.dest(paths.build.development + '/style'))
        .pipe(connect.reload());
  } else if (process.env.environment === 'production') {
    libSources = gulp.src(paths.style.lib[0]);
    appSources = gulp.src(paths.style.app);

    var styleStream = series(libSources, appSources)
        .pipe(handleErrors(errorHandler))
        .pipe(minifyCSS())
        .on('error', errorHandler)
        .pipe(concat(paths.build.style.production))
        .pipe(gulp.dest(paths.build.production));

    var fontStream = gulp.src(paths.style.lib[1], {base: './bower_components/semantic-ui/dist'})
        .pipe(handleErrors(errorHandler))
        .pipe(gulp.dest(paths.build.production));

    return series(styleStream, fontStream);
  }
});

var bundler = browserify({
  entries: [paths.scripts.entry],
  transform: flags.production ? [reactify, uglifyify] : [reactify, lrload],
  debug: !flags.production,
  cache: {},
  packageCache: {},
  fullPaths: true // for watchify
});

gulp.task('watch', ['style'], function () {
  lrload.monitor(paths.build.development + '/' + paths.build.script.development, {displayNotification: true});
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.style.app, ['style']);

  var watcher = watchify(bundler);
  bundle();
  return watcher
      .on('error', errorHandler)
      .on('update', bundle);

  function bundle() {
    var updateStart = Date.now();
    gutil.log(gutil.colors.green('Updating JavaScript bundle') + '...');
    watcher
        .bundle()
        .on('error', errorHandler)
        .pipe(source(paths.build.script.development))
        .pipe(streamify(substituter(config.parse)))
        .pipe(gulp.dest(paths.build.development));
    gutil.log(gutil.colors.green('Complete!'), 'after', gutil.colors.magenta((Date.now() - updateStart) + 'ms'));
  }

});

gulp.task('clean', function (cb) {
  var environment = flags.production ? 'production' : 'development';
  gutil.log(gutil.colors.green('Cleaning', environment, 'directory'));
  del([paths.build[environment] + '/**/*'], cb);
});

gulp.task('compileScripts', function () {
  return bundler
      .bundle()
      .on('error', errorHandler)
      .pipe(source(paths.build.script.production))
      .pipe(streamify(substituter(config.parse)))
      .pipe(gulp.dest(paths.build.production));
});

gulp.task('default', function () {
  process.env.environment = 'development';
  sequence('watch', 'html', 'connect');
});

gulp.task('build', function () {
  process.env.environment = 'production';
  sequence('compileScripts', 'style', 'html');
});

gulp.task('native', function () {
  var appPaths = [
    paths.build.production + '/' + paths.build.script.production,
    paths.build.production + '/' + paths.build.style.production
  ];

  return gulp.src(appPaths)
      .pipe(handleErrors(errorHandler))
      .pipe(gulp.dest(paths.build.native))
      .pipe(shell('cordova build ios --device', {cwd: 'native'}));
});
