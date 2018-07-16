const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const APP_DIR = path.resolve(__dirname, "src/");
const BUILD_DIR = path.resolve(__dirname, "dist/");

module.exports = {
    entry: APP_DIR + "/main.js",
    output: {
        path: BUILD_DIR,
        filename: "[name].bundle.js"
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
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: APP_DIR + "/index.html"
        })
    ]
};
