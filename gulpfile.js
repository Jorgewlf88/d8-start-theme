var gulp           = require('gulp');
var jshint         = require('gulp-jshint');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var rename         = require('gulp-rename');
var sass           = require('gulp-sass');
var autoprefixer   = require('gulp-autoprefixer');
var browserSync    = require('browser-sync').create();
var sourcemaps     = require('gulp-sourcemaps');

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

// Lint Task
gulp.task('lint', function() {
  return gulp.src(['js/dev/scripts.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Sass Task with sourcemaps
gulp.task('sass-sourcemap', function () {
  return gulp
    .src('scss/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(rename('global.min.css'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Sass Task
gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename('global.min.css'))
    .pipe(gulp.dest('css'));
});

// Js Task
gulp.task('scripts', function() {
  return gulp
    .src(['js/dev/scripts.js'])
    .pipe(concat('scripts_concat.js'))
    .pipe(gulp.dest('js/dev'))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Static Server
gulp.task('serve', ['sass-sourcemap', 'scripts'], function() {
  browserSync.init({
    // server: "./"
    proxy: 'http://192.168.0.0/',
    notify: {
      styles: {
          top: 'auto',
          bottom: '0'
      }
    }
  });
  gulp.watch('js/**/*.js', ['lint', 'scripts']);
  gulp.watch('scss/**/*.scss', ['sass-sourcemap']);
  gulp.watch(['templates/*.twig', 'js/dev/scripts.js']).on('change', browserSync.reload);
});

// Local Develpment Task
gulp.task('dev', ['serve' , 'lint']);

// Production Task
gulp.task('default', ['sass', 'scripts']);
