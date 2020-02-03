const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      through2 = require('through2'),
      ngAotCompliant = require('gulp-aot-compliant');

function logCopied()
{
    return through2.obj(function(vinyl, enc, callback)
    {
        console.log("Copying follow file: '" + vinyl.path + "'");
        this.push(vinyl);

        callback();
    });
}

gulp.task("create-aot-app", function()
{
    return gulp.src("app/**/*")
        .pipe(logCopied())
        .pipe(ngAotCompliant({
                                 mainFilename: 'main.server.ts',
                                 serverModule: 'ServerAppModule',
                                 serverModuleFilename: 'server-app.module'
                             }))
        .pipe(gulp.dest("app.aot"));
});

gulp.task("copy-config", function()
{
    return gulp.src("config/i18n/**/*.json")
        .pipe(logCopied())
        .pipe(gulp.dest("wwwroot/config/i18n"));
});

gulp.task("watch-config", ["copy-config"], function()
{
    return watch('config/i18n/**/*.json', { events: ['change', 'add'] })
        .pipe(through2.obj(function(vinyl, enc, cb)
                           {
                               if(vinyl.event == 'change' || vinyl.event == 'add')
                               {
                                   console.log("File '" + vinyl.basename + "' is being copied.");
                               }

                               this.push(vinyl);
                               cb();
                           }))
        .pipe(gulp.dest('wwwroot/config/i18n'));
});

gulp.task("copy-help", function()
{
    return gulp.src("content/help/**/*.*")
        .pipe(logCopied())
        .pipe(gulp.dest("wwwroot/dist/md"));
});

gulp.task("watch-help", ["copy-help"], function()
{
    return watch('content/help/**/*.*', { events: ['change', 'add'] })
        .pipe(through2.obj(function(vinyl, enc, cb)
                           {
                               if(vinyl.event == 'change' || vinyl.event == 'add')
                               {
                                   console.log("File '" + vinyl.basename + "' is being copied.");
                               }

                               this.push(vinyl);
                               cb();
                           }))
        .pipe(gulp.dest('wwwroot/dist/md'));
});

gulp.task("compile-scss", function()
{
    return gulp.src('content/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/content'));
});

gulp.task("build",
          ["copy-config"],
          function(cb)
{
    console.log("Gulp build has finished");

    cb();
});

gulp.task("build:aot",
          ["build",
           "create-aot-app"],
          function(cb)
{
    console.log("Gulp build aot has finished");

    cb();
});