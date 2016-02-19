/**
 * @author  Jozef Butko
 * @url		  www.jozefbutko.com/resume
 * @date    March 2015
 * @license MIT
 *
 * AngularJS Boilerplate: Build, watch and other useful tasks
 *
 * The build process consists of following steps:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    $               = require('gulp-load-plugins')(),
    del             = require('del'),
    runSequence     = require('run-sequence');
    inject          = require('gulp-inject');
    series          = require('stream-series');
    KarmaServer     = require('karma').Server;

var paths = {
  scripts: ['app/**/*.js'],
  css: 'app/**/*.css',
  html: ['app/**/*.html'],
  libs: {
    js: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/angular-sanitize/angular-sanitize.min.js',
      'libs/lodash.min.js'
    ],
    css: ['node_modules/materialize-css/dist/css/materialize.min.css'],
    font: ['node_modules/materialize-css/dist/font/**']
  },
  dist: {
    base: 'dist',
    js: 'dist/js',
    css: 'dist/css',
    font: 'dist/font',
    partials: 'dist/partials'
  }
};

// browser-sync task
gulp.task('browser-sync', function () {
    browserSync.init({
      injectChanges: true,
        server: {
            baseDir: 'dist'
        }
    });
});

// start webserver from dist folder to check how it will look in production
gulp.task('server-build', function(done) {
  return browserSync({
    server: {
      baseDir: 'dist'
    }
  }, done);
});

// Concat and copy libs JS files to dist
gulp.task('copy:libs-dev', function() {
  return gulp.src(paths.libs.js)
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(paths.dist.js + '/libs'));
});

// Concat and copy libs JS files to dist
gulp.task('copy:libs-prod', function() {
  return gulp.src(paths.libs.js)
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(paths.dist.js));
});

// Concat app JS files and copy to dist
gulp.task('copy:js-dev', function() {
  return gulp.src(paths.scripts)
    //.pipe($.concat('app.js'))
    .pipe(gulp.dest(paths.dist.js));
});

// Concat, minify and copy JS files to dist
gulp.task('copy:js-prod', function() {
  return gulp.src(paths.scripts)
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist.js));
});

// Copy css to dist
gulp.task('copy:css', function() {
  gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist.css));

  gulp.src(paths.libs.css)
    .pipe(gulp.dest(paths.dist.css));

  return gulp.src(paths.libs.font)
    .pipe(gulp.dest(paths.dist.font));
});

// Copy html to dist
gulp.task('copy:html', function() {
  gulp.src('index.html')
    .pipe(gulp.dest(paths.dist.base));

  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dist.partials));
});

// Copy mock data to dist
gulp.task('copy:data', function() {
  return gulp.src('data.json')
    .pipe(gulp.dest(paths.dist.base));
});

gulp.task('index:dev', function () {
  var target = gulp.src(paths.dist.base + '/index.html');
  var libStream = gulp.src([paths.dist.js + '/libs/libs.js', paths.dist.css + '/*.css'], {read: false});
  var appStream = gulp.src([paths.dist.js + '/**/*.js', '!' + paths.dist.js + '/libs/libs.js'], {read: false});

  return target.pipe(inject(series(libStream, appStream), {relative: true})) // This will always inject vendor files before app files
    .pipe(gulp.dest(paths.dist.base));
});

gulp.task('index:prod', function () {
  var target = gulp.src(paths.dist.base + '/index.html');
  var libStream = gulp.src([paths.dist.js + '/libs.js', paths.dist.css + '/*.css'], {read: false});
  var appStream = gulp.src([paths.dist.js + '/app.min.js'], {read: false});

  return target.pipe(inject(series(libStream, appStream), {relative: true})) // This will always inject vendor files before app files
    .pipe(gulp.dest(paths.dist.base));
});

gulp.task('build:dev', function (callback) {
  runSequence(
    'clean:dist',
    'copy:libs-dev',
    'copy:js-dev',
    'copy:html',
    'copy:css',
    'copy:data',
    'index:dev',
    'browser-sync',
    'watch',
    callback);
});

gulp.task('build:prod', function (callback) {
  runSequence(
    'clean:dist',
    'copy:libs-prod',
    'copy:js-prod',
    'copy:html',
    'copy:css',
    'copy:data',
    'index:prod',
    'server-build',
    callback);
});

// Watch for changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['copy:js-dev', browserSync.reload]);
  gulp.watch(paths.css, ['copy:css', browserSync.reload]);
  gulp.watch(paths.html, function () {
    runSequence(
      'copy:html',
      'index',
      browserSync.reload
    );
  });
});

// Broken due to a bug https://github.com/karma-runner/gulp-karma/issues/30
gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});


//--------------------------------------------------------------------

// minify CSS
gulp.task('minify-css', function() {
  gulp.src(['./styles/**/*.css', '!./styles/**/*.min.css'])
    .pipe($.rename({suffix: '.min'}))
    .pipe($.minifyCss({keepBreaks:true}))
    .pipe(gulp.dest('./styles/'))
    .pipe(gulp.dest('./_build/css/'));
});

// minify HTML
gulp.task('minify-html', function() {
  var opts = {
    comments: true,
    spare: true,
    conditionals: true
  };

  gulp.src('./*.html')
    .pipe($.minifyHtml(opts))
    .pipe(gulp.dest('./_build/'));
});

// start webserver
gulp.task('server', function(done) {
  return browserSync({
    server: {
      baseDir: './'
    }
  }, done);
});

// start webserver from _build folder to check how it will look in production
gulp.task('server-build', function(done) {
  return browserSync({
    server: {
      baseDir: 'dist/'
    }
  }, done);
});

// delete dist folder
gulp.task('clean:dist', function (cb) {
  del([
    'dist/'
    // if we don't want to clean any file we can use negate pattern
    //'!dist/mobile/deploy.json'
  ], cb);
});

// SASS task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
  return gulp.src('styles/style.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      style: 'expanded'
    }))
    .on('error', $.notify.onError({
      title: 'SASS Failed',
      message: 'Error(s) occurred during compile!'
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('styles'))
    .pipe(reload({
      stream: true
    }))
    .pipe($.notify({
      message: 'Styles task complete'
    }));
});

// SASS Build task
gulp.task('sass:build', function() {
  var s = $.size();

  return gulp.src('styles/style.scss')
    .pipe($.sass({
      style: 'compact'
    }))
    .pipe($.autoprefixer('last 3 version'))
    .pipe($.uncss({
      html: ['./index.html', './views/**/*.html', './components/**/*.html'],
      ignore: [
        '.index',
        '.slick',
        /\.owl+/,
        /\.owl-next/,
        /\.owl-prev/
      ]
    }))
    .pipe($.minifyCss({
      keepBreaks: true,
      aggressiveMerging: false,
      advanced: false
    }))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('_build/css'))
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total CSS size ' + s.prettySize;
      }
    }));
});

// BUGFIX: warning: possible EventEmitter memory leak detected. 11 listeners added.
require('events').EventEmitter.prototype._maxListeners = 100;

// index.html build
// script/css concatenation
gulp.task('usemin', function() {
  return gulp.src('./index.html')
    // add templates path
    .pipe($.htmlReplace({
      'templates': '<script type="text/javascript" src="js/templates.js"></script>'
    }))
    .pipe($.usemin({
      css: [$.minifyCss(), 'concat'],
      libs: [$.uglify()],
      nonangularlibs: [$.uglify()],
      angularlibs: [$.uglify()],
      appcomponents: [$.uglify()],
      mainapp: [$.uglify()]
    }))
    .pipe(gulp.dest('./_build/'));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
  return gulp.src([
      './**/*.html',
      '!node_modules/**/*.*',
      '!_build/**/*.*'
    ])
    .pipe($.minifyHtml())
    .pipe($.angularTemplatecache({
      module: 'boilerplate'
    }))
    .pipe(gulp.dest('_build/js'));
});

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
});


// default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync', 'sass', 'minify-css'], function() {
  gulp.watch('styles/*.css', function(file) {
    if (file.type === 'changed') {
      reload(file.path);
    }
  });
  gulp.watch(['*.html', 'app/**/*.html'], ['bs-reload']);
  gulp.watch(['app/**/*.js', 'js/*.js'], ['build-js', 'bs-reload']);
  gulp.watch('styles/**/*.scss', ['sass', 'minify-css']);
});


/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
/*gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass:build',
    'build-js',
    'copy-html',
    callback);
});*/

