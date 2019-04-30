const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

//////////////// DEVELOPMENT MODE ////////////////
module.exports = {
    entry: "./src/index.js",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        alias: {
            // bind version of jquery-ui
            "jquery-ui": "jquery-ui/jquery-ui.js",
            // bind to modules;
            modules: path.join(__dirname, "node_modules")}
    },
    output: {
        path: path.resolve(__dirname, "/dist"),
        publicPath: "/",
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "public/"),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        hotOnly: true,
        inline: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin(envKeys),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
    ]
};

// //////////////// DEPLOYMENT MODE ////////////////
// module.exports = {
//     entry: "./src/index.js",
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /(node_modules|bower_components)/,
//                 loader: "babel-loader",
//                 options: { presets: ["@babel/env"] }
//             },
//             {
//                 test: /\.css$/,
//                 use: ["style-loader", "css-loader"]
//             },
//             {
//                 test: /\.(png|jpg)$/,
//                 loader: 'url-loader'
//             }
//         ]
//     },
//     resolve: { extensions: ["*", ".js", ".jsx"] },
//     output: {
//         path: path.resolve(__dirname, "build"),
//         publicPath: "/",
//         filename: "bundle.js"
//     },
//     devServer: {
//         contentBase: "./build",
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: path.resolve('./public/index.html'),
//         }),
//         new webpack.DefinePlugin(envKeys)
//     ]
// };