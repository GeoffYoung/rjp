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
  'src/sass/main.scss'
];

var jsFiles = [
  "node_modules/jquery/dist/jquery.js",
  "src/js/main.js"
];

var images = [
  'src/img/*'
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
    .pipe(gulp.dest('dist/css'));
});



gulp.task('js', ['js-lint', 'js-build']);

gulp.task('js-lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js-build', function() {
  gulp.src(jsFiles)
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(uglify())
      .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});



gulp.task('img', function(){
  gulp.src(images)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});



gulp.task('watch', function() {
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/js/*.js',     ['js']);
    gulp.watch('./src/img/*',       ['img']);
});

gulp.task('serve', function() {
    gulp.start('watch');

    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});
