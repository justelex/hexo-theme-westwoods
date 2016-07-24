// jshint esversion: 6

const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');

gulp.task('default', ['compress-js', 'compress-css']);

gulp.task('compress-js', cb => pump([
        gulp.src('source/js/**/!(*.min.js)'),
        uglify(),
        concat('all.min.js'),
        gulp.dest('source/js')
    ])
);

gulp.task('compress-css', cb => pump([
        gulp.src('source/css/**/!(*.min.css)'),
        cssmin(),
        concat('all.min.css'),
        gulp.dest('source/css')
    ])
);
