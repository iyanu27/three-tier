const path = require("path");
const webpack = require("webpack");

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('env', NODE_ENV);
const webpackOption = {
    entry: "./app/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/, // node modules should be es5
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        }),
    ],
    mode: NODE_ENV, // Allow hot reloading in development mode
    /*
        The python data controller endpoint is being proxied by the node server to bypass CORS requirements
     */
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8085',
                pathRewrite: {'^/api': ''}
            }
        },
        disableHostCheck: true,
        host: '0.0.0.0'
    },
};

module.exports = webpackOption;