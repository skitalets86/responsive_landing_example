const gulp = require('gulp');
const runseq = require('run-sequence');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');


/* Server */
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });


    gulp.watch('build/**/*').on('change', browserSync.reload);
});


/* Pug compile */
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('src/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});


/* Styles compile */
gulp.task('styles:compile', function () {
    return gulp.src('src/styles/' + '/**/*.{scss,sass}')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
});


/* Sprite */
gulp.task('sprite', function () {
    const spriteData = gulp.src('src/img/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../img/sprite.png',
      cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('./build/img/'));
    spriteData.css.pipe(gulp.dest('./build/styles/global/'));
});


/* Delete */
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});


/*  Copy fonts  */
gulp.task('copy:fonts', function() {
    return gulp.src('./src/fonts/**/*.*')
      .pipe(gulp.dest('build/fonts'));
});


/*  Copy images  */
gulp.task('copy:images', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});


/* Copy - common task  */
gulp.task('copy', [
    'copy:fonts', 
    'copy:images'
]);


/* Watchers */
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', ['templates:compile']);
    gulp.watch('source/styles/**/*.scss', ['styles:compile']);
});


/* Default task */
gulp.task('default', function () {
    runseq(
        'clean',
        ['templates:compile', 'styles:compile', 'sprite', 'copy'],
        ['watch', 'server']
    )
});
