var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


function swallowError (error) {
  // If you want details of the error in the console
  gutil.log(gutil.colors.red(error.toString()));
  gutil.beep(3);
  this.emit('end');
}

gulp.task('sass', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(
      {
        errLogToConsole: true
      }))
    .on('error', swallowError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Safari > 6.1', 'iOS > 7.1']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css')
    );
});

gulp.task('build', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sass(
      {
        outputStyle: 'compressed',
        errLogToConsole: true
      }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Safari > 6.1', 'iOS > 7.1']
    }))
    .pipe(gulp.dest('./css')
    );
});

// Watch Files For Changes
gulp.task('watch', function() {
  console.log('Livereload running on 35729');
  livereload.listen({
    host: null
  });
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('css/**/*.css').on('change', livereload.changed);
});

// Default task
gulp.task('default', ['sass', 'watch']);