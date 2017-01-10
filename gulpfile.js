var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');  

//script paths
var jsFiles = [
        "!wwwroot/js/vendor/modernizr-custom.min.js",
        "!wwwroot/js/scripts*.js",
        "wwwroot/js/vendor/jquery-3.1.1.min.js",
        "wwwroot/js/vendor/bootstrap.min.js",
        "wwwroot/js/vendor/jquery.matchingHeight.min.js",
        "wwwroot/js/vendor/photoswipe.min.js",
        "wwwroot/js/vendor/photoswipe-ui-default.min.js",
        "wwwroot/js/vendor/touchwipe.min.js",
        "wwwroot/js/*.js"];
var jsDest = 'wwwroot/js';

gulp.task('scripts', function() {  
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('webserver', function() {
  gulp.src('wwwroot')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('styles', function() {
    gulp.src('wwwroot/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task('watchCss',function() {
    gulp.watch('wwwroot/css/**/*.scss', ['styles']);
});


gulp.task('build', ['styles']);

gulp.task('debug', ['watchCss', 'webserver']);