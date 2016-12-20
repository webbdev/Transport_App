var gulp = require('gulp');

// plugins
var wiredep = require('wiredep').stream;
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var rename = require("gulp-rename");
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var notify = require("gulp-notify");
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var connect = require('gulp-connect');

// CSS autoprefixer
gulp.task('css:prefix', function () {
  return gulp.src('app/css/main.css')
	.pipe(autoprefixer({
	  browsers: ['last 10 versions'],
	  cascade: false
	}))
	.pipe(gulp.dest('./app/css/'))
	.pipe(notify({ message: 'css:build task complete' }));
});

gulp.task('bower', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: "./app/bower_components" 
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('json', function() {
  gulp.src(['app/json/caltrain-data.json'])
      .pipe(gulp.dest('dist/json'));
});

gulp.task('pics', function() {
  gulp.src(['app/images/*'])
      .pipe(gulp.dest('dist/images'));
});

gulp.task('pdf', function() {
  gulp.src(['app/pdf/*'])
      .pipe(gulp.dest('dist/pdf'));
});

gulp.task('templates', function() {
  gulp.src(['app/templates/*'])
      .pipe(gulp.dest('dist/templates'));
});

gulp.task('copy:bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('sw', function() {
  gulp.src(['app/sw.js'])
      .pipe(gulp.dest('dist/'))
});


// JS, CSS minify, concatenate
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'html task complete' }));
});

// HTML minify
gulp.task('html:min', function() {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'html:min task complete' }));
});

gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9000
  });
});

// Watch
gulp.task('watch', function() {
    // watch bower.json file
    gulp.watch('bower.json', ['bower']);
    // Watch .html files
    gulp.watch('dist/*.html', ['html:min']);
});


// The default task (called when you run 'gulp' from cli)
gulp.task('dist', ['css:prefix', 'bower', 'json', 'pics', 'pdf', 'templates', 'copy:bower-components', 'sw', 'html', 'html:min', 'connectDist', 'watch']);