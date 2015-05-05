var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var config = {
    src: {
        base: 'client',
        get js () { return path.join(this.base, 'javascripts/**/*.js'); },
        get views () { return path.join(this.base, 'views', '**/*')}
    },
    build: {
        base : 'build',
        js   : {
            get dir() {
                return path.join(config.build.base, 'javascripts');
            },
            file : 'app.js'
        },
        get views () { return path.join(this.base, 'views') }
    }
};

gulp.task('views', function () {
    gulp.src(config.src.views)
        .pipe(gulp.dest(config.build.views));
});

gulp.task('js', function () {
    gulp.src([config.src.js])
        .pipe(sourcemaps.init())
            .pipe(concat(config.build.js.file))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.build.js.dir))
});


gulp.task('watch:js', ['js'], function () {
    gulp.watch(config.src.js, ['js']);
});

gulp.task('watch:views', ['views'], function () {
    gulp.watch(config.src.views, ['views']);
});

gulp.task('watch', ['watch:js', 'watch:views']);
