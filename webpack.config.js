const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const APP_DIR = path.resolve(__dirname, "src/");
const BUILD_DIR = path.resolve(__dirname, "dist/");

module.exports = {
    entry: APP_DIR + "/main.js",
    devtool: "source-map",
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js"
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                "source-map-loader",
            ],
            enforce: "pre"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                "babel-loader",
                "eslint-loader"
            ]
        }, {
            test: /\.scss$/,
            use: [
                "style-loader?sourceMap",
                "css-loader?sourceMap",
                "sass-loader?sourceMap"
            ]
        }, {
            test: /\.(geojson|png)$/,
            loader: "file-loader",
            options: {
                name: "assets/[name].[ext]",
            }
        }]
    },
    devtool: "source-maps",
    plugins: [
        new HtmlWebpackPlugin({
            template: APP_DIR + "/index.html"
        })
    ]
};
