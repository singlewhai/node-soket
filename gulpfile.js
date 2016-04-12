'use strict';

var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
 
gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})
 
gulp.task('develop', function () {
  nodemon({ 
      script: 'server.js'
      , ext: 'html js'
      , ignore: ['config.js']
      , tasks: ['lint'] })
    .on('restart', function () {
        console.log('restarted!')
    })
})

