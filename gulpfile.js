var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
 
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
    gulp.watch('wwwroot/css/**/*.scss',['styles']);
});


gulp.task('build', ['styles']);

gulp.task('debug', ['watchCss', 'webserver']);