var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sassLint    = require('gulp-sass-lint');
var jshint      = require('gulp-jshint');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var imagemin    = require('gulp-imagemin');
var browserSync = require('browser-sync').create();


var styleSheets = [
  'assets/sass/main.scss'
];

var jsFiles = [
  "node_modules/jquery/dist/jquery.js",
  "assets/js/main.js"
];

var images = [
  'assets/img/*'
];


gulp.task('default', ['build', 'serve']);
gulp.task('build', ['sass', 'js', 'img']);


gulp.task('sass', ['sass-lint', 'sass-build']);

gulp.task('sass-lint', function(){
  gulp.src(styleSheets)
    .pipe(sassLint({
      "sasslintConfig": ".sass-lint.yml"
    }))
    .pipe(sassLint.format());
});

gulp.task('sass-build', function () {
  return gulp.src(styleSheets)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
    browserSync.reload();
});



gulp.task('js', ['js-lint', 'js-build']);

gulp.task('js-lint', function() {
  return gulp.src('assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js-build', function() {
  gulp.src(jsFiles)
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./js'))
      .pipe(uglify())
      .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'));
    browserSync.reload();
});



gulp.task('img', function(){
  gulp.src(images)
    .pipe(imagemin())
    .pipe(gulp.dest('./img'));
    browserSync.reload();
});



gulp.task('watch', function() {
    gulp.watch('./assets/sass/*.scss', ['sass']);
    gulp.watch('./assets/js/*.js',     ['js']);
    gulp.watch('./assets/img/*',       ['img']);
});

gulp.task('serve', function() {
    gulp.watch('./assets/sass/*.scss', ['sass']);
    gulp.watch('./assets/js/*.js',     ['js']);
    gulp.watch('./assets/img/*',       ['img']);
    gulp.watch("app/*.html")
        .on('change', browserSync.reload);

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
