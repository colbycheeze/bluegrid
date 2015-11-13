//TODO:
// - Add source maps
// - Figure out why gulp run fails once build folder exists

import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
const bsync = browserSync.create();
const reload = bsync.reload;
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


const dir = {
  src: './src',
  dest: './build',
  dist: './dist',
  sass: './sass'
}

const stylePath = {
  src: `${dir.src}/styles`,
  dest: `${dir.dest}/css`,
  dist: `${dir.dist}`,
  sass: `${dir.sass}`
}

const scriptPath = {
  src: `${dir.src}/scripts`,
  dest: `${dir.dest}/js`
}

const imagePath = {
  src: `${dir.src}/images`,
  dest: `${dir.dest}/assets/images`
}

gulp.task('serve', function(cb) {
  bsync.init({
    server: { baseDir: dir.dest }
  });

  gulp.watch(`${stylePath.src}/**/*.scss`, ['compile:styles']);
  gulp.watch(`${scriptPath.src}/**/*.js`, ['compile:scripts']);
  gulp.watch(`${imagePath.src}/**/*`, ['compile:images']);
  gulp.watch(`${dir.src}/**/*.html`, ['compile:html']);
  cb();
});

gulp.task('clean', function(cb) {
  del.sync([`${dir.dest}/**`]);
  cb();
});

gulp.task('compile', function(cb) {
  runSequence([
    'compile:html',
    'compile:images',
    'compile:scripts',
    'compile:styles'
  ], cb);
});

gulp.task('compile:styles', () => {
  return gulp.src(`${stylePath.src}/**/*.scss`)
  .pipe($.plumber())
  .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(stylePath.dest))
  .pipe(bsync.stream());
});

gulp.task('compile:scripts', () => {
  return gulp.src(`${scriptPath.src}/**/*.js`)
  .pipe($.plumber())
  .pipe($.uglify())
  .pipe(gulp.dest(scriptPath.dest))
  .pipe(bsync.stream());
});

gulp.task('compile:images', () => {
  return gulp.src(`${imagePath.src}/*`)
  .pipe($.plumber())
  .pipe($.size())
  .pipe(gulp.dest(imagePath.dest))
  .pipe(bsync.stream());
});

gulp.task('compile:html', () => {
  return gulp.src([`${dir.src}/*.html`])
  .pipe($.plumber())
  .pipe(gulp.dest(dir.dest))
  .pipe(bsync.stream());
});

gulp.task('package', function(cb) {
  runSequence('package:clean', ['package:dist', 'package:sass'], cb);
});

gulp.task('package:clean', function(cb) {
  del.sync([`${dir.dist}/**`, `${dir.sass}/**`]);
  cb();
});

gulp.task('package:sass', () => {
  return gulp.src([`${stylePath.src}/bluegrid/**`])
  .pipe(gulp.dest(`${dir.sass}/bluegrid`))
});

gulp.task('package:dist', () => {
  return gulp.src([`${stylePath.src}/bluegrid/_bluegrid.scss`])
  .pipe($.rename('main.scss')) // TODO: why is this necessary?
  .pipe($.sass({outputStyle: 'compressed'}))
  .pipe($.autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe($.rename('bluegrid.min.css'))
  .pipe(gulp.dest(dir.dist))
});

gulp.task('build', function(cb) {
  runSequence('clean', ['compile', 'package'], cb);
});

gulp.task('deploy', ['build'], () => {
  return gulp.src(`${dir.dest}/**/*`)
  .pipe($.ghPages({force:true}));
});

gulp.task('default', function(cb) {
  runSequence('clean', ['compile', 'serve'], cb);
});
