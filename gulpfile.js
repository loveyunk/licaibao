var gulp = require('gulp');
var rev = require('gulp-rev');  // 生成文件哈希名
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');  // 合并css, js
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');  // 压缩js
var csso = require('gulp-csso');  // 压缩css
var browserSync = require('browser-sync').create();

gulp.task("index", function () {
    var jsFilter = filter("**/*.js", {restore: true});
    var cssFilter = filter("**/*.css", {restore: true});
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], {restore: true});

    return gulp.src("src/index.html")
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'));
});

// Static Server + watching scss/html files
gulp.task('serve', function () {

    browserSync.init({
        server: "./src"
    });
    
    // gulp.watch('src/js/*.js', ['scripts']);         //监控文件变化，自动更新
    // gulp.watch('src/css/*.css', ['style']);
    // gulp.watch('*.html', ['html']);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
    gulp.watch("src/css/*.css").on('change', browserSync.reload);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     return gulp.src("app/scss/*.scss")
//         .pipe(sass())
//         .pipe(gulp.dest("app/css"))
//         .pipe(browserSync.stream());
// });

gulp.task('default', ['serve']);
