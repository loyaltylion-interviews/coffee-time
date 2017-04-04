var gulp = require ('gulp');
var less = require ('gulp-less');
var resizeImgs = require('gulp-image-resize');
var renameFile = require('gulp-rename');


gulp.task ('styles', function () {
    return gulp.src('app/styles/src/*.less')
        .pipe(less())
        .pipe(gulp.dest('app/styles/dist/'))
});


gulp.task('resize', function () {
    gulp.src('app/img/src/*.{jpg,png}')
        .pipe(resizeImgs({
            height: 800,
            crop: false,
        }))
        .pipe(renameFile(function (path) { path.basename += '-1px'; }))
        .pipe(gulp.dest('app/img/dist/'))

    gulp.src('app/img/src/*.{jpg,png}')
        .pipe(resizeImgs({
            width: 1500,
            crop: false,
        }))
        .pipe(renameFile(function (path) { path.basename += '-2px'; }))
        .pipe(gulp.dest('app/img/dist/'))

    gulp.src('app/img/src/*.{jpg,png}')
        .pipe(resizeImgs({
            width: 2000,
            crop: false,
            upscale: true,
        }))
        .pipe(renameFile(function (path) { path.basename += '-3px'; }))
        .pipe(gulp.dest('app/img/dist/'))
})
