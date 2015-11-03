//TODO
// Add minify process
// Add source maps
// Figure out why run-sequence doesn't work

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
}

const stylePath = {
  src: `${dir.src}/styles`,
  dest: `${dir.dest}/css`
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

gulp.task('build', ['clean', 'compile']);
// gulp.task('build', ['clean', 'compile', 'minify']);
//
gulp.task('deploy', () => {
  return gulp.src(`${dir.dest}/**/*`)
    .pipe($.ghPages({force:true}));
});

// gulp.task('dev', function(callback) {
//   runSequence('clean', 'compile', 'serve', callback);
// });

gulp.task('default', ['clean', 'compile', 'serve']);

// Minify plugins
// gulp-csso
// vinyl-paths
// gulp-filter
// gulp-rev-all

// gulp.task('minifyVersion', function(cb) {
//   var cssGlob     = '*|)}>#*.css',
//       jsGlob      = '*|)}>#*.js',
//       mapGlob     = '*|)}>#*.map',
//       cssFilter   = $.filter(cssGlob),
//       jsFilter    = $.filter(jsGlob),
//       assetFilter = $.filter([cssGlob, jsGlob, mapGlob]),
//       vp          = vinylPaths();
//
//   return gulp.src(DIR.DIST + '#<{(|*')
//     // Store asset paths to delete after stream
//     .pipe(assetFilter)
//     .pipe(vp)
//     .pipe(assetFilter.restore())
//     // Minify JS
//     .pipe(jsFilter)
//     .pipe($.uglify())
//     .on('error', $.notify.onError('Uglify failed'))
//     .on('error', $.util.log)
//     .pipe(jsFilter.restore())
//     // Minify CSS
//     .pipe(cssFilter)
//     .pipe($.csso())
//     .on('error', $.notify.onError('CSSO failed'))
//     .on('error', $.util.log)
//     .pipe(cssFilter.restore())
//     // Version assets
//     .pipe($.revAll({
//       ignore: ['.html']
//     }))
//     .pipe(gulp.dest(DIR.DIST))
//     // Show asset sizes
//     .pipe($.size({
//       showFiles: true,
//       gzip: true
//     }))
//     // Delete unversioned assets
//     .on('end', function() {
//       del(vp.paths);
//     }, cb);
// });
//
