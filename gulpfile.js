const gulp = require('gulp'),
  browserSync = require('browser-sync'),
  del = require('del'),
  gutil = require('gulp-util'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  // Styles
  sass = require('gulp-sass'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  postcss = require('gulp-postcss'),
  // JavaScripts
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify');

gulp.task('clean', next => {
  del.sync('./dist');
  return next();
});

gulp.task('serve', () => {
  browserSync({
    server: {
      baseDir: './dist'
    },
    notify: false,
    open: false
  });
});

gulp.task('spit', () => {
  gulp
    .src([
      './app/index.html',
    ])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', () => {
  gulp
    .src(
      './app/img/**'
    )
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('style', () => {
  let plugins = [
    autoprefixer({ browsers: ['last 5 version'] }),
    cssnano({
      safe: true,
      discardComments: false,
      minifyFontValues: false
    })
  ];
  return gulp
    .src('./app/sass/*.scss')
    .pipe(sass({ outputStyle: 'expand' }))
    .pipe(postcss(plugins))
    .on('error', message => {gutil.log(gutil.colors.red('[Error]'), message.toString());notify.onError();})
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('script', () => {
  gulp
    .src('./app/js/index.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('./dist/js/'));
    Scripts();
});

Scripts = () => {
  return gulp
    .src(['./app/libs/anime.js', './dist/js/index.js'])
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .on('error', message => {gutil.log(gutil.colors.red('[Error]'), message.toString());})
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
};

gulp.task('watch', ['style', 'script', 'serve', 'spit'], () => {
  gulp.watch('./app/*.html', ['spit']);
  gulp.watch('./app/sass/**.scss', ['style']);
  gulp.watch(['./app/libs/*.js', './app/js/index.js'], ['script']);
  gulp.watch('./app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);
