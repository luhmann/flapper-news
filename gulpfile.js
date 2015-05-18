var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var config = {
    src: {
        base: 'client',
        get css () { return path.join(this.base, 'stylesheets/**/*.sass')},
        js: {
            get app() {
                return path.join(config.src.base, 'javascripts/**/*.js');
            },
            get vendors() {
                return [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-ui-router/build/angular-ui-router.js'
                ]
            }
        },
        get views () { return path.join(this.base, 'views', '**/*')}
    },
    build: {
        base : 'build',
        get css()  { return path.join(this.base, 'stylesheets') },
        js   : {
            get dir() {
                return path.join(config.build.base, 'javascripts');
            },
            file : 'app.js'
        },
        get views () { return path.join(this.base, 'views') }
    }
};

/** HTML */
gulp.task('views', function () {
    gulp.src(config.src.views)
        .pipe(gulp.dest(config.build.views));
});

/** JS */
gulp.task('js', function () {
    gulp.src(config.src.js.vendors.concat([config.src.js.app]))
        .pipe(sourcemaps.init())
            .pipe(concat(config.build.js.file))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.build.js.dir))
});


gulp.task('watch:js', ['js'], function () {
    gulp.watch(config.src.js.app, ['js']);
});

gulp.task('watch:views', ['views'], function () {
    gulp.watch(config.src.views, ['views']);
});

gulp.task('watch', ['watch:js', 'watch:views', 'watch:sass']);

/** CSS */
gulp.task('sass', function () {
    gulp.src(config.src.css)
        .pipe(sass( { indentedSyntax: true } ))
        .pipe(gulp.dest(config.build.css));
});

gulp.task('watch:sass', ['sass'], function () {
    gulp.watch(config.src.css, [ 'sass' ]);
});

gulp.task('build', ['views', 'sass', 'js']);