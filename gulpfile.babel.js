'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import pug from  'gulp-pug';
import { create } from 'browser-sync';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';

const browserSync = create();

const config = {
  server: "./dist",
  tunnel: false,

  host: "localhost",
  port: 3000,
  logPrefix: "simple-gulp",
  reloadOnRestart: true,
  inject: true,
  open: false
};

gulp.task('sass', () => {
  return gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 version']
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('pug', () => {
  return gulp.src('./src/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('img', () => {
  return gulp.src('./src/**/*.{jpg,jpeg,png,svg}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('server', () => {
  browserSync.init(config);
  browserSync.watch('dist/**/*').on('change', browserSync.reload);
});

gulp.task('pug:watch', () => {
  gulp.watch('./src/**/*.pug', gulp.series('pug'));
});

gulp.task('img:watch', () => {
  gulp.watch('./src/**/*.{jpg,jpeg,png,svg}', gulp.series('img'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./src/**/*.scss', gulp.series('sass'));
});

gulp.task('watch', gulp.parallel('pug:watch', 'sass:watch', 'img:watch'));

gulp.task('start', gulp.series('pug', 'sass', 'img', gulp.parallel('server', 'watch')));
