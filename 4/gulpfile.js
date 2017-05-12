/**
 * Created by Administrator on 2017/5/11.
 */
const gulp=require('gulp');
const sass=require('gulp-sass');
const browserify=require('gulp-browserify');
const concat=require('gulp-concat');
const webserver=require('gulp-webserver');
const rev=require('gulp-rev');
const revcollector=require('gulp-rev-collector');
//sass编译
gulp.task("cssmin",function(){
    gulp.src('./src/css/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
});
//模块化打包
gulp.task('browser', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat("common.js"))
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./build/js'))
});
gulp.task('html', function () {
    gulp.src('src/html/*.html')
        .pipe(rev())//MD5版本控制
        .pipe(gulp.dest('./build/html'))
        .pipe(rev.manifest())//生成一个rev-manifest.json
        .pipe(gulp.dest("./rev/html"));//将rev-manifest.json存放到的路径
});
//文件名替换
gulp.task('rev', function () {
    gulp.src('rev/**/*.json')
        .pipe(revcollector({
            replaceReved: true,
            dirReplacements: {
                'html': 'html'
                //'cdn/': function(manifest_value) {
                //    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                //}
            }//执行文件内html名的替换
        }))
        .pipe(gulp.dest('./build/html'));
});
//热启动
gulp.task('webserver',["build"],function() {
    gulp.src('./build/html')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});
//执行全部
gulp.task('build',["cssmin","browser","rev","html"]);