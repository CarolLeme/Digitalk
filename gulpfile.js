const gulp = require('gulp'),
clean = require('gulp-clean'),
plumber = require('gulp-plumber'),
imagemin = require('gulp-imagemin'),
htmlmin = require('gulp-htmlmin'),
concat = require('gulp-concat'),
browserSync = require('browser-sync'),
sourceMaps = require('gulp-sourcemaps'),
stylus = require('gulp-stylus'),
jeet = require('jeet'),
koutoSwiss = require('kouto-swiss'),
uglify = require('gulp-uglify'),
babel = require('gulp-babel'),
rename = require("gulp-rename"),
rupture = require('rupture');

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
});

gulp.task('copy', function () {
  return gulp.src(['src/{fonts,images}/**/*'], {base: 'src'})
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({stream: true}));
});

// Delete the archives
gulp.task('clean', function () {
  return gulp.src('dist/', {read: false})
  .pipe(clean({force: true}));
});

// Compile Stylus for CSS
gulp.task('stylus', function () {
  gulp.src('src/styl/main.styl')
  .pipe(plumber())
  .pipe(stylus({
    use: [koutoSwiss(), jeet(), rupture()],
    'resolve url': true,
    // 'include css': true,
    define: {
      url: require('stylus').resolver()
    }
    ,compress: true
  }))
  .pipe(gulp.dest('dist/styles/'))
  .pipe(browserSync.reload({stream: true}));
});

/* Minify HTML */
gulp.task('minify-html', function () {
  return gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
  return gulp.src('./src/js/**/*.js')
  .pipe(babel({
    presets: ['env']
  }))
  .pipe(sourceMaps.init({loadMaps: true}))
  .pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourceMaps.write('./'))
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.reload({stream: true}));
});

/* Optimize Images */
gulp.task('imagemin', function () {
  return gulp.src('src/images/**/*')
  .pipe(plumber())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [
      {removeViewBox: false},
      {cleanupIDs: false}
    ],
    interlaced: true,
    optimizationLevel: 3
  }))
  .pipe(gulp.dest('dist/images/'))
  .pipe(browserSync.reload({stream: true}))
});

/* Default */
gulp.task('default', ['stylus', 'js', 'imagemin', 'copy', 'minify-html', 'watch', 'browser-sync']);

/* Watch */
gulp.task('watch', function () {
  gulp.watch('src/images/**/*', ['imagemin']);
  gulp.watch('src/styl/**/*.styl', ['stylus']);
  gulp.watch('src/*.html', ['minify-html']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch(['src/{fonts,vendor}/**/*'], ['copy']);
});
