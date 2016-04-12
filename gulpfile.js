'use strict';

var gulp    = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint  = require('gulp-jshint')
  , refresh = require('gulp-livereload')
 
gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
});

gulp.task('serve', function(){
    nodemon({script: 'server.js'})
    .on('restart', function () {
        console.log('restarted!')
    })

});

gulp.task('watch', ['lint', 'serve'], function(){
    gulp.watch([
        './**/*.js',
        './*.js'
    ]).on('change', function(){
        console.log('change');
    });
});

gulp.task('default', ['watch']);


