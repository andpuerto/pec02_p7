'use strict';

//Utilizacion de modulos
var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var imagemin = require('gulp-imagemin');
var ignore = require('gulp-ignore');

//Paths de origen
var srcPaths = {
    images:   'src/img/',
    scripts:  'src/js/',
    styles:   'src/scss/',
    fonts:   'src/fonts/',
    files:    'src/'
};


//Paths de destino
var distPaths = {
    images:   'dist/img/',
    scripts:  'dist/js/',
    styles:   'dist/css/',
    fonts:   'dist/fonts/',
    files:    'dist/'
};



//Elimina todos los archivos de dist
gulp.task('clean', function(cb) {
    del([ distPaths.files+'*.html', distPaths.images+'**/*', distPaths.scripts+'*.js', distPaths.styles+'*.css'], cb);
});

// Copia de los cambios en los ficheros html en el directorio dist.
gulp.task('copyHtml', function() {
    return gulp.src([srcPaths.files+'*.html'])
        .pipe(gulp.dest(distPaths.files))
        .pipe(browserSync.stream());
});

// Copia de los cambios en los ficheros json en el directorio dist.
gulp.task('copyJson', function() {
    return gulp.src([srcPaths.files+'*.json'])
        .pipe(gulp.dest(distPaths.files))
        .pipe(browserSync.stream());
});



// Copia las fuentes de texto.
gulp.task('copyFont', function() {
    return gulp.src([srcPaths.fonts+'**/*'])
        .pipe(gulp.dest(distPaths.fonts))
        .pipe(browserSync.stream());
});

//Mimimizar las imagenes
gulp.task('imagemin', function() {
    return gulp.src([srcPaths.images+'**/*'])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(distPaths.images))
        .pipe(browserSync.stream());
});


//Inicia browser-sync
gulp.task('browser-sync', function(){
        browserSync.init({
        server:{
            baseDir:"./dist"
        }
    });
});


//Genera el css a partir de sass
gulp.task('build-css', function() {
    return gulp.src([srcPaths.styles+'**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest(distPaths.styles))
        .pipe(browserSync.stream());
});

//Copia los css estandar que podamos tener
gulp.task('copyCss', function() {
    return gulp.src([srcPaths.styles+'**/*.css'])
        .pipe(gulp.dest(distPaths.styles))
        .pipe(browserSync.stream());
});

//Utiliza jshint para detectar errores en javascript
//bootstrap.js genera errores, por lo que lo excluimos
gulp.task('lint', function() {
    return gulp.src([srcPaths.scripts+'**/*.js'])
        .pipe(ignore.exclude('bootstrap.js'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});



//Concatena todos los ficheros javascritp en uno solo y lo minimiza.
//Antes de ejecutarse, lanza la tarea lint
gulp.task('js', ['lint'], function() {
//    return gulp.src([srcPaths.scripts+'main.js', srcPaths.scripts+'extra.js'])
    return gulp.src([srcPaths.scripts+'**/*.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distPaths.scripts))
        .pipe(browserSync.stream());
});


//Agrega los watch para los cambios en los ficheros. Antes ejecuta todas las tareas
//y lanza browser-sync
gulp.task('watch', ['copyHtml', 'copyJson', 'imagemin', 'copyFont', 'build-css', 'copyCss', 'js', 'browser-sync'], function() {
    gulp.watch(srcPaths.files+'*.html', ['copyHtml']);
    gulp.watch(srcPaths.files+'*.json', ['copyJson']);
    gulp.watch(srcPaths.images+'**/*', ['imagemin']);
    gulp.watch(srcPaths.fonts+'**/*', ['copyFont']);
    gulp.watch(srcPaths.styles+'**/*.scss', ['build-css']);
    gulp.watch(srcPaths.styles+'**/*.css', ['copyCss']);
    gulp.watch(srcPaths.scripts+'**/*.js', ['js']);
});

//La tarea por defecto, limpia los ficheros y lanza la tarea watch
gulp.task('default', ['clean', 'watch'], function() {});

