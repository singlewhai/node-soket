'use strict';

var gulp    = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint  = require('gulp-jshint')
  , refresh = require('gulp-livereload')
 
gulp.task('styles', function() {
    return gulp.src('angular/styles/main.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
    return gulp.src('./**/*.js')
        .pipe(jshint())
});

gulp.task('html', ['styles'], function() {
    var cssChannel = lazypipe()
        .pipe($.csso)
        .pipe($.replace, 'bower_components/bootstrap/fonts', 'fonts');

    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.ngAnnotate()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', cssChannel()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')().concat('angular/fonts/**/*')
    .concat('bower_components/bootstrap/fonts/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', function(){
    nodemon({script: 'server.js'})
    .on('restart', function () {
        console.log('restarted!')
    })

});

gulp.task('watch', ['jshint', 'serve'], function(){
    gulp.watch([
        './**/*.js',
        './*.js'
    ]).on('change', ['serve']);
    gulp.watch([
        './**/*.js',
        './*.js'
    ]).on('change', ['serve']);
    gulp.watch('bower.json', ['wiredep']);
    gulp.watch('angular/styles/**/*.less', ['styles']);
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  var exclude = [
    /*'bootstrap',*/
    'es5-shim',
    'json3',
    'angular-scenario'
  ];

  gulp.src('angular/styles/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('angular/*.html')
    .pipe(wiredep({exclude: exclude}))
    .pipe(gulp.dest('app'));
});



gulp.task('builddist', ['jshint', 'html', 'images', 'fonts'],
  function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('build', ['clean'], function() {
  gulp.start('builddist');
});

gulp.task('default', ['watch', 'wiredep']);


