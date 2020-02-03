var webpack = require('webpack'),
    path = require('path');

module.exports = function()
{
    var distPath = "wwwroot/dist";

    var config =
    {
        entry:
        {
            "dependencies":
            [
                "./webpack.config.dev.imports"
            ]
        },
        output:
        {
            path: path.join(__dirname, distPath),
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        mode: 'development',
        devtool: 'none', //'source-map'
        resolve:
        {
            extensions: ['.ts', '.js'],
            alias:
            {
                "numeral-languages": path.join(__dirname, "node_modules/numeral/locales.js"),
                "handlebars": path.join(__dirname, "node_modules/handlebars/dist/handlebars.js"),
                "typeahead": path.join(__dirname, "node_modules/typeahead.js/dist/typeahead.jquery.js"),
                "bloodhound": path.join(__dirname, "node_modules/typeahead.js/dist/bloodhound.js"),
                "moment": path.join(__dirname, "node_modules/moment/min/moment-with-locales.js")
            }
        },
        module:
        {
            rules:
            [
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
                {
                    test: /\.html$/,
                    use: 
                    {
                        loader: 'html-loader'
                    }
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude:
                    [
                        path.join(__dirname, "app")
                    ]
                }
            ]
        },
        plugins:
        [
            new webpack.DllPlugin(
            {
                path: path.join(__dirname, distPath + '/[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin(
            {
                jsDevMode: true
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    return config;
};