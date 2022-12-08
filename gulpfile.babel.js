const { src, series, parallel, dest, watch } = require('gulp');
// Importing all the Gulp related packages
const sourcemaps = require('gulp-sourcemaps');
// gulp-sass no longer has a default Sass compiler
// Both the "sass" and "node-sass" packages are permitted
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const gulpMode = require('gulp-mode')(); // perform certain tasks only for --production mode.
const browserSync = require('browser-sync').create();
const del = require('del');

// RollUp Plugins for JS Bundling
const rollup = require('gulp-better-rollup');
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

// CONST & VARIABLES
const DIST_DIRECTORY = 'dist';

const FILE_PATHS = {
    html: {
        src: 'app/*.html',
        dest: DIST_DIRECTORY,
    },
    scss: {
        src: 'app/scss/**/*.scss',
        dest: `${DIST_DIRECTORY}/css`,
        destFileName: 'styles.css',
    },
    js: {
        // keep events.js last so that all functions are registered before event is fired
        src: ['app/js/app.js'],
        dest: `${DIST_DIRECTORY}/js`,
        destFileName: 'script.js',
    },
    images: {
        src: 'app/images/**/*',
        dest: `${DIST_DIRECTORY}/images`,
    },
    static: {
        src: 'app/static/**/*',
        dest: `${DIST_DIRECTORY}/static`,
    },
};

/////////////////
// GULP TASKS //
////////////////

// SCSS TASK: creates a minified styles.css file in DESTINATION FOLDER
function scssBuildTask() {
    return src(FILE_PATHS.scss.src)
        .pipe(gulpMode.development(sourcemaps.init())) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(concat(FILE_PATHS.scss.destFileName))
        .pipe(gulpMode.production(postcss([autoprefixer(), cssnano()]))) // PostCSS plugins, PROD-ONLY
        .pipe(gulpMode.development(sourcemaps.write('.'))) // write sourcemaps file in current directory
        .pipe(dest(FILE_PATHS.scss.dest)) // put final CSS in destination folder
        .pipe(browserSync.stream());
}

// JS: concatenates and uglifies JS files to script.js
function jsTask() {
    return (
        src(FILE_PATHS.js.src)
            .pipe(sourcemaps.init())
            // https://blog.openreplay.com/the-ultimate-guide-to-getting-started-with-the-rollup-js-javascript-bundler
            .pipe(
                rollup(
                    {
                        plugins: [
                            babel({ exclude: 'node_modules/**' }),
                            resolve({
                                jsnext: true,
                                main: true,
                                browser: true,
                            }),
                            commonjs(),
                            gulpMode.production(uglify()),
                        ],
                    },
                    'iife'
                )
            )
            .pipe(sourcemaps.write('.'))
            .pipe(dest(FILE_PATHS.js.dest))
    );
}

// Image: Compress image and move it to dist folder.
function imageTask() {
    return src(FILE_PATHS.images.src)
        .pipe(
            // PROD-ONLY
            gulpMode.production(
                imagemin(
                    [
                        imagemin.gifsicle({ interlaced: true }),
                        imagemin.mozjpeg({ quality: 65, progressive: true }),
                        imagemin.optipng({ optimizationLevel: 4 }),
                        imagemin.svgo({
                            plugins: [
                                { removeViewBox: true },
                                { cleanupIDs: true },
                            ],
                        }),
                    ],
                    {
                        verbose: true,
                    }
                )
            )
        )
        .pipe(dest(FILE_PATHS.images.dest));
}

// STATIC COPY: Copy static items to dest folder
function staticCopyTask() {
    return src(FILE_PATHS.static.src).pipe(dest(FILE_PATHS.static.dest));
}

// CACHEBUST: replace '?cb={number}' string in html files to enable cache busting for css
// Uses gulp replace to find ?cb and replace it with timestamp
function cacheBustTask() {
    var cbString = new Date().getTime(); // get new cb based on current time
    return src(FILE_PATHS.html.src)
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest(FILE_PATHS.html.dest));
}

// CLEAN DISTRIBUTION FOLDER: Clean existing builds when serving or building.
function clean() {
    return del(`${DIST_DIRECTORY}/**'`, { force: true });
}

// Watch task: watch SCSS, JS and HTML files for changes
function watchTask() {
    browserSync.init({
        injectChanges: true,
        https: true,
        server: {
            baseDir: `./${DIST_DIRECTORY}`,
        },
    });

    watch([FILE_PATHS.scss.src], scssBuildTask);
    watch([...FILE_PATHS.js.src], jsTask);
    watch([FILE_PATHS.html.src]).on(
        'change',
        series(cacheBustTask, browserSync.reload)
    );
}

// DEVELOPMENT SERVE
exports.serve = series(
    clean,
    parallel(scssBuildTask, jsTask, imageTask, staticCopyTask),
    cacheBustTask,
    series(watchTask)
);

// PROD BUILD
exports.build = series(
    clean,
    parallel(scssBuildTask, jsTask, imageTask, staticCopyTask),
    cacheBustTask
);
