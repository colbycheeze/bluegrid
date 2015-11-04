//TODO:
// - Add source maps
// - Figure out why run-sequence doesn't work (or do I even need it?)
// - Figure out why first gulp run fails

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

gulp.task('serve', function() {
  bsync.init({
    server: { baseDir: dir.dest }
  });

  gulp.watch(`${stylePath.src}/**/*.scss`, ['compile:styles']);
  gulp.watch(`${scriptPath.src}/**/*.js`, ['compile:scripts']);
  gulp.watch(`${imagePath.src}/**/*`, ['compile:images']);
  gulp.watch(`${dir.src}/**/*.html`, ['compile:html']);
});

gulp.task('clean', function(cb) {
  del([`${dir.dest}/**`], cb);
});

gulp.task('compile', [
  'compile:html',
  'compile:images',
  'compile:scripts',
  'compile:styles'
]);

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
    .pipe($.size())
    .pipe(gulp.dest(imagePath.dest))
    .pipe(bsync.stream());
});

gulp.task('compile:html', () => {
  return gulp.src([`${dir.src}/*.html`])
  .pipe(gulp.dest(dir.dest))
  .pipe(bsync.stream());
});

gulp.task('package', ['package:clean','package:dist', 'package:sass']);

gulp.task('package:clean', function(cb) {
  del([`${dir.dist}/**`]); // TODO: Do I need the cb??
  del([`${dir.sass}/**`], cb);
});

gulp.task('package:sass', () => {
  return gulp.src([`${stylePath.src}/_grid.scss`])
  .pipe($.rename('_bluegrid.scss'))
  .pipe(gulp.dest(dir.sass))
});

gulp.task('package:dist', () => {
  return gulp.src([`${stylePath.src}/_grid.scss`])
  .pipe($.rename('main.scss')) // TODO: why is this necessary?
  .pipe($.sass({outputStyle: 'compressed'}))
  .pipe($.autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe($.rename('bluegrid.min.css'))
  .pipe(gulp.dest(dir.dist))
});

gulp.task('build', ['clean', 'compile', 'package']);
// gulp.task('build', ['clean', 'compile', 'minify']);

gulp.task('deploy', ['build'], () => {
  return gulp.src(`${dir.dest}/**/*`)
    .pipe($.ghPages({force:true}));
});

gulp.task('default', ['clean', 'compile', 'serve']);
