const gulp = require("gulp");
const concat = require("gulp-concat");
const strip = require("gulp-strip-comments");
const uglify = require("gulp-uglify-es").default;
const sourcemaps = require("gulp-sourcemaps");

gulp.task("scripts", function () {
  return gulp
    .src(["src/validation_patterns.js", "src/formhandler_options.js", "src/formshandler.js", "src/formhandler_datalayer.js"])
    .pipe(strip())
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist"))
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
  gulp.watch("src/*.js", gulp.series("scripts"));
});

gulp.task("default", gulp.series("scripts", "watch"));
