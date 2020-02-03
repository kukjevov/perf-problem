var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
    HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    CompressionPlugin = require("compression-webpack-plugin"),
    SpeedMeasurePlugin = require("speed-measure-webpack-plugin"),
    ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'),
    ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    rxPaths = require('rxjs/_esm5/path-mapping'),
    extend = require('extend'),
    AngularCompilerPlugin =  require('@ngtools/webpack').AngularCompilerPlugin;

//array of paths for server and browser tsconfigs
const tsconfigs =
{
    client: path.join(__dirname, 'tsconfig.browser.json'),
    server: path.join(__dirname, 'tsconfig.server.json')
};

/**
 * Gets entries for webpack
 * @param {boolean} aot Indicates that it should be AOT entries
 * @param {boolean} ssr Indicates that it should be entries for server side rendering
 * @param {boolean} hmr Indication that currently is running hmr build
 */
function getEntries(aot, ssr, hmr, dll)
{
    if(ssr)
    {
        return {
            server: aot ? path.join(__dirname, "app.aot/main.server.ts") : path.join(__dirname, "app/main.server.ts")
        };
    }
    else
    {
        var entries =
        {
            ...dll ? {"import-dependencies": './webpack.config.dev.imports'} : {},
            externalStyle:
            [
                "@angular/material/prebuilt-themes/indigo-pink.css",
                "font-awesome/css/font-awesome.min.css",
                "bootstrap/dist/css/bootstrap.min.css",
                "bootstrap/dist/css/bootstrap-theme.min.css",
                path.join(__dirname, "content/external/fonts/ace-custom/css/ace-custom.css"),
                "bootstrap-select/dist/css/bootstrap-select.min.css",
                "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
                "bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css",
                "highlight.js/styles/googlecode.css"
            ],
            style: [path.join(__dirname, "content/site.scss")],
            client: hmr ? [path.join(__dirname, "app/main.browser.hmr.ts")] : (aot ? [path.join(__dirname, "app.aot/main.browser.ts")] : [path.join(__dirname, "app/main.browser.ts")])
        };

        entryPoints = Object.keys(entries);

        return entries;
    }
}

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {string} platform Should either be client or server
 * @returns
 */
function getAotPlugin(platform)
{
    return new AngularCompilerPlugin(
    {
        tsConfigPath: tsconfigs[platform],
        sourceMap: true
    });
}

/**
 * Gets array of webpack loaders for typescript files
 * @param {boolean} hmr Indication that currently is running build using HMR
 */
function getTypescriptLoaders(aot)
{
    if(aot)
    {
        return ['@ngtools/webpack'];
    }
    else
    {
        return [
            {
                loader: 'ts-loader',
                options: 
                {
                    transpileOnly: true
                }
            },
            'angular2-template-loader',
            'webpack-lazy-module-loader'
        ];
    }
}

/**
 * Gets array of webpack loaders for external style files
 * @param {boolean} prod Indication that currently is running production build
 */
function getExternalStyleLoaders(prod)
{
    return prod ? [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ""}}, 'css-loader'] : ['style-loader', 'css-loader'];
}

/**
 * Gets array of webpack loaders for style files
 * @param {boolean} prod Indication that currently is running production build
 */
function getStyleLoaders(prod)
{
    return prod ? [{loader: MiniCssExtractPlugin.loader, options: {publicPath: ""}}, 'css-loader', 'sass-loader'] : ['style-loader', 'css-loader', 'sass-loader'];
}

var entryPoints = [];

module.exports =
[
    function(options, args)
    {
        var prod = args && args.mode == 'production' || false;
        var hmr = !!options && !!options.hmr;
        var aot = !!options && !!options.aot;
        var ssr = !!options && !!options.ssr;
        var dll = !!options && !!options.dll;
        var debug = !!options && !!options.debug;
        var ngsw = process.env.NGSW == "true";

        if(!!options && options.ngsw != undefined)
        {
            ngsw = !!options.ngsw;
        }

        console.log(`Angular service worker enabled: ${ngsw}.`);

        var distPath = "wwwroot/dist";
        options = options || {};

        console.log(`Running build with following configuration Production: ${prod} Hot Module Replacement: ${hmr} Ahead Of Time Compilation: ${aot} Server Side Rendering: ${ssr} Debugging compilation: ${debug}`);

        var config =
        {
            entry: getEntries(aot, ssr, hmr, dll),
            output:
            {
                path: path.join(__dirname, distPath),
                filename: '[name].js',
                publicPath: prod ? 'dist/' : '/dist/',
                chunkFilename: `[name].${ssr ? 'server' : 'client'}.chunk.js`
            },
            mode: 'development',
            devtool: hmr ? 'none' : 'source-map',
            target: ssr ? 'node' : 'web',
            resolve:
            {
                symlinks: false,
                extensions: ['.ts', '.js'],
                alias: extend(rxPaths(),
                {
                    "modernizr": path.join(__dirname, "content/external/scripts/modernizr-custom.js"),
                    "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                    "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                    "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                    "bloodhound": path.join(__dirname, "node_modules/typeahead.js/dist/bloodhound.js"),
                    "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js"),
                    "config/global": path.join(__dirname, "config/config.js"),
                    "config/default": path.join(__dirname, prod ? "config/global.json" : "config/global.development.json"),
                    "config/version": path.join(__dirname, "config/version.json"),
                    "app": path.join(__dirname, "app")
                })
                // mainFields: ['esm5', 'browser', 'module', 'main'] 
            },
            module:
            {
                rules:
                [
                    //server globals
                    {
                        test: require.resolve("form-data"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: 'FormData'
                            }
                        ]
                    },
                    //vendor globals
                    {
                        test: require.resolve("jquery"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: '$'
                            },
                            {
                                loader: 'expose-loader',
                                options: 'jQuery'
                            }
                        ]
                    },
                    {
                        test: require.resolve("numeral"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: 'numeral'
                            }
                        ]
                    },
                    {
                        test: require.resolve("konami"),
                        use:
                        [
                            {
                                loader: 'expose-loader',
                                options: 'Konami'
                            }
                        ]
                    },
                    //file processing
                    {
                        test: aot ? /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/ : /\.ts$/,
                        use: getTypescriptLoaders(aot)
                    },
                    {
                        test: /\.html$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.component\.scss$/,
                        use: ['raw-loader', 'sass-loader'],
                        include:
                        [
                            path.join(__dirname, "app")
                        ]
                    },
                    {
                        test: /\.component\.css$/,
                        use: 'raw-loader',
                        include:
                        [
                            path.join(__dirname, "packages")
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: getExternalStyleLoaders(prod),
                        exclude:
                        [
                            path.join(__dirname, "app"),
                            path.join(__dirname, "packages")
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: getStyleLoaders(prod),
                        exclude:
                        [
                            path.join(__dirname, "app")
                        ]
                    },
                    {
                        test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                        loader: "file-loader"
                    }
                ]
            },
            plugins:
            [
                // new WebpackNotifierPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true, sound: false}),
                //copy external dependencies
                new CopyWebpackPlugin(
                [
                ]),
                new webpack.DefinePlugin(
                {
                    isProduction: prod,
                    isNgsw: ngsw,
                    jsDevMode: !prod,
                    ngDevMode: !prod
                })
                // new webpack.IgnorePlugin(/\.\/locale$/),
            ]
        };

        //server specific settings
        if(ssr)
        {
        }
        //client specific settings
        else
        {
            config.plugins.push(new HtmlWebpackPlugin(
            {
                filename: "../index.html",
                template: path.join(__dirname, "index.html"),
                inject: 'head',
                chunksSortMode: function orderEntryLast(left, right)
                {
                    let leftIndex = entryPoints.indexOf(left.names[0]);
                    let rightIndex = entryPoints.indexOf(right.names[0]);

                    if (leftIndex > rightIndex)
                    {
                        return 1;
                    }
                    else if (leftIndex < rightIndex)
                    {
                        return -1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            }));

            if(!debug)
            {
                config.plugins.push(new ScriptExtHtmlWebpackPlugin(
                                    {
                                        defaultAttribute: 'defer'
                                    }));
            }
        }

        //aot specific settings
        if(aot)
        {
            config.plugins.push(getAotPlugin(ssr ? 'server' : 'client'));
        }

        if(hmr)
        {
            config.plugins.push(new webpack.HotModuleReplacementPlugin());

            Object.keys(config.entry).forEach(entry =>
            {
                if(config.entry[entry].constructor === Array)
                {
                    config.entry[entry].unshift('webpack-hot-middleware/client');
                }
            });
        }

        //only if dll package is required, use only for development
        if(dll)
        {
            config.plugins.push(new webpack.DllReferencePlugin(
            {
                context: __dirname,
                manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
            }));

            if(!debug)
            {
                config.plugins.push(new HtmlWebpackIncludeAssetsPlugin(
                {
                    assets: ['dependencies.js'],
                    append: false
                }));
            }
        }

        //production specific settings - prod is used only for client part
        if(prod)
        {
            config.output.filename = "[name].[hash].js";
            config.output.chunkFilename = `[name].${ssr ? 'server' : 'client'}.chunk.[chunkhash].js`;

            config.plugins.push(new MiniCssExtractPlugin(
            {
                filename: '[name].[hash].css',
                chunkFilename: '[id].[hash].css',
            }));

            config.plugins.push(new CompressionPlugin({test: /\.js$|\.css$/}));
        }
        else
        {
            config.plugins.push(new ForkTsCheckerWebpackPlugin());
            config.plugins.push(new ForkTsCheckerNotifierWebpackPlugin({title: `Webpack - ${hmr ? 'HMR' : (ssr ? 'SSR' : 'BUILD')}`, excludeWarnings: true, alwaysNotify: true, sound: false}));
        }

        //this is used for debugging speed of compilation
        if(debug)
        {
            config.plugins.push(new BundleAnalyzerPlugin());

            let smp = new SpeedMeasurePlugin({outputFormat: 'humanVerbose'});

            return smp.wrap(config);
        }

        return config;
    }
]