var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    pump    = require('pump');
var through = require('through2');
var modify = require('modify-filename');
var minify = require('gulp-minify');


var babel = require('gulp-babel');
//定义css、js源文件路径
var cssSrc = './sourse/css/*.css',
    jsSrc = './sourse/js/*.js';


//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
var cssnano = require('gulp-cssnano');
gulp.task('revCss', function(){
    return gulp.src(cssSrc)
        .pipe(cssnano())
        .pipe(rev())
        // .pipe(through.obj(function(file, enc, cb) {
        //     // write the NEW path
        //     file.path = modify(file.revOrigPath, function(name, ext) {
        //         return name + '.min' + ext + '?' + file.revHash;
        //     });
        //     // send it back to stream
        //     cb(null, file);
        // }))
        .pipe(gulp.dest('./public/static/icebear2018/src/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/static/icebear2018/src/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
var uglify = require('gulp-uglify');
gulp.task('revJs', function(){
    return gulp.src(jsSrc)
        //.pipe(uglify())
        // .pipe(babel({
        //   presets: ['es2015']
        // }))
        .pipe(babel())
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(babel())
        .pipe(rev())

        // .pipe(through.obj(function(file, enc, cb) {
        //     // write the NEW path
        //     file.path = modify(file.revOrigPath, function(name, ext) {
        //         return name + '.min' + ext + '?' + file.revHash;
        //     });
        //     // send it back to stream
        //     cb(null, file);
        // }))                       //给文件添加hash编码
        .pipe(gulp.dest('./public/static/icebear2018/src/js'))
        .pipe(rev.manifest())          //生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('./public/static/icebear2018/src/js'));
});

var concat = require('gulp-concat');
gulp.task('componentJs', function(){
    return gulp.src('./sourse/components/*/*.js')
        .pipe(babel())
        .pipe(concat('components.js'))   //合并成的js文件名称
        //.pipe(uglify())            //压缩
        //.pipe(gulp.dest('build'));    //打包压缩在build目录下。
        //.pipe(rev())                //给文件添加hash编码
        //.pipe(gulp.dest('./public/static/icebear2018/src/js'))
        //.pipe(rev.manifest())          //生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('./sourse/js'));
});
// gulp.task('babel-sourcemaps', () => {
//   return gulp.src(paramConfig.source)
//     .pipe(sourcemaps.init())
//     .pipe(babel())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(paramConfig.dest))
// })

//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['./public/static/icebear2018/src/**/rev-manifest.json', './sourse/html/*.html'])
        //.pipe(revCollector())
        .pipe(revCollector({ //执行替换
            replaceReved:true,
            dirReplacements:{
                './sourse/css':'/static/icebear2018/src/css',
                './sourse/js':'/static/icebear2018/src/js'
            }
        }))                      //替换html中对应的记录
        .pipe(gulp.dest('./application/index/view/common_view')); //输出到该文件夹中
});
gulp.task('liveCss', function () {
    return gulp.src('./sourse/live/css/*.css')
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest('./public/static/icebear2018/src/css/live/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/static/icebear2018/src/css/live/'));
});
gulp.task('liveJs', function(){
    return gulp.src('./sourse/live/js/*.js')
        //.pipe(uglify({ mangle: false }))
        .pipe(babel())
        .pipe(uglify({
            mangle:true
        }))
        //.pipe(minify())
        .pipe(rev())
        // .pipe(through.obj(function(file, enc, cb) {
        //     // write the NEW path
        //     file.path = modify(file.revOrigPath, function(name, ext) {
        //         return name + '.min' + ext + '?' + file.revHash;
        //     });
        //     // send it back to stream
        //     cb(null, file);
        // }))                       //给文件添加hash编码
        //.pipe(rev())
        .pipe(gulp.dest('./public/static/icebear2018/src/js/live/'))
        .pipe(rev.manifest())          //生成rev-mainfest.json文件作为记录
        .pipe(gulp.dest('./public/static/icebear2018/src/js/live/'));
});
gulp.task('liveHtml', function () {
    return gulp.src(['./public/static/icebear2018/src/css/live/*.json','./public/static/icebear2018/src/js/live/*.json', './sourse/live/*.html'])
        //.pipe(revCollector())
        .pipe(revCollector({ //执行替换
            replaceReved:true,
            dirReplacements:{
                './sourse/live/css':'/static/icebear2018/src/css/live/',
                './sourse/live/js':'/static/icebear2018/src/js/live/'
            }
        }))                      //替换html中对应的记录
        .pipe(gulp.dest('./application/index/view/live')); //输出到该文件夹中
});

var clean  = require('gulp-clean');
gulp.task('clean:css', function(cb) {
    pump([
        gulp.src(['./public/static/icebear2018/src/css/app.css*']),
        clean()
    ], cb)
})
gulp.task('clean:js', function(cb) {
    pump([
        gulp.src([ './public/static/icebear2018/src/js/*.js']),
        clean()
    ], cb)
})
gulp.task('clean:livecss', function(cb) {
    pump([
        gulp.src(['./public/static/icebear2018/src/css/live/*.css']),
        clean()
    ], cb)
})
gulp.task('clean:livejs', function(cb) {
    pump([
        gulp.src([ './public/static/icebear2018/src/js/live/*.js']),
        clean()
    ], cb)
})

gulp.task('watch',function(){
    gulp.watch(cssSrc,['clean:css','revCss']);
    gulp.watch(jsSrc,['componentJs','clean:js','revJs']);
    gulp.watch(['./public/static/icebear2018/src/**/rev-manifest.json','./sourse/html/*.html'],['revHtml']);
})
gulp.task('wl',function(){
    gulp.watch('./sourse/live/css/*.css',['clean:livecss','liveCss']);
    gulp.watch('./sourse/live/js/*.js',['clean:livejs','liveJs']);
    gulp.watch(['./public/static/icebear2018/src/css/live/rev-manifest.json','./public/static/icebear2018/src/js/live/rev-manifest.json', './sourse/live/*.html'],['liveHtml']);
})
gulp.task('live', function (done) {
    condition = false;
    //依次顺序执行
    runSequence(
        ['liveCss'],
        ['liveJs'],
        ['liveHtml'],
        done);
});
//开发构建
gulp.task('dev', function (done) {
    condition = false;
    //依次顺序执行
    runSequence(
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});
gulp.task('default', ['dev']);