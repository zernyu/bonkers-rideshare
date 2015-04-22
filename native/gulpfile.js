var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var substitute = require('gulp-substituter');
var sh = require('shelljs');
var config = require('./www/config');

var paths = {
  html: 'www/app.html',
  js: 'www/js/**/*.js',
  sass: ['scss/**/*.scss']
};

gulp.task('default', ['sass', 'html']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
      .pipe(sass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest('./www/css/'))
      .pipe(minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(rename({extname: '.min.css'}))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
});

gulp.task('html', function (done) {
  gulp.src(paths.html)
      .pipe(inject(gulp.src(paths.js, {read: false}), {
        relative: true
      }))
      .pipe(substitute(config.parse))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('www/'))
      .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch([paths.html, paths.js], ['html']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
      .on('log', function (data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
      });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
        '  ' + gutil.colors.red('Git is not installed.'),
        '\n  Git, the version control system, is required to download Ionic.',
        '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
        '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
