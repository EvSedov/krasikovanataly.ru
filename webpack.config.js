const PugPlugin = require("pug-plugin");
const globule = require("globule");
const fs = require("fs");
const path = require("path");

let mode = 'development'
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

const mixins = globule
    .find(["src/pug/mixins/**/*.pug"], ["!src/pug/mixins/_mixins.pug"])
    .map((path) => path.split('/').pop())
    .reduce((acc, currentItem) => acc + `include ${currentItem}\n`, ``);

fs.writeFile("src/pug/mixins/_mixins.pug", mixins, (err) => {
    if (err) throw err;
    console.log("Mixins are generated automatically!");
});

const paths = globule.find(["src/pug/pages/**/*.pug"]);

module.exports = {
    mode: mode,
    output: {
        path: path.join(__dirname, 'dist/'),
        clean: true,
    },
    devServer: {
        open: true,
        static: {
            directory: './src',
            watch: true
        }
    },
    devtool: 'source-map',
    entry: {
        index: './src/pug/pages/index.pug',
        license: './src/pug/pages/license.pug'
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            js: {
              // output filename of extracted JS file from source script defined in Pug
              filename: 'assets/js/[name].[contenthash:8].js',
            },
            css: {
              // output filename of extracted CSS file from source style defined in Pug
              filename: 'assets/css/[name].[contenthash:8].css',
            },
          })
        ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[name].[hash:8][ext]',
                },
            },
            {
                test: /\.(pdf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/docs/[name].[hash:8][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.pug$/,
                loader: PugPlugin.loader,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
}