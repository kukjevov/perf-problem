var connect = require('connect'),
    gzipStatic = require('connect-gzip-static'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback'),
    argv = require('yargs').argv,
    bodyParser = require('body-parser'),
    connectExtensions = require('nodejs-connect-extensions');

var app = connect();

connectExtensions.extendConnectUse(app);

const wwwroot = "wwwroot";

//enable webpack only if run with --webpack param
if(!!argv.webpack)
{
    var webpack = require('webpack'),
        webpackConfigs = require('./webpack.config.js'),
        webpackDev = require('webpack-dev-middleware'),
        hmr = require("webpack-hot-middleware");

    var config = webpackConfigs[0]({hmr: true, dll: true});
    var compiler = webpack(config);

    //enables webpack dev middleware
    app.use(webpackDev(compiler,
    {
        publicPath: config.output.publicPath
    }));

    app.use(hmr(compiler));

    config = webpackConfigs[1]();
    compiler = webpack(config);

    //enables webpack dev middleware
    app.use(webpackDev(compiler,
    {
        publicPath: config.output.publicPath
    }));
}

//config override
app.use('GET', /\/config$/, function(_req, res)
{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(require('./config/global.override')));
});

//mock rest api
require('./server.mock')(app);

//parse html request json body
app.use(bodyParser.json({limit: '50mb'}));

//enable html5 routing
app.use(history());

//return static files
app.use(gzipStatic(wwwroot,
                   {
                       maxAge: '1d',
                       setHeaders: function setCustomCacheControl (res, path)
                       {
                           if (serveStatic.mime.lookup(path) === 'text/html')
                           {
                               // Custom Cache-Control for HTML files
                               res.setHeader('Cache-Control', 'public, max-age=0');
                           }
                       }
                   }));

console.log("Listening on port 8888 => http://localhost:8888");
//create node.js http server and listen on port
app.listen(8888);