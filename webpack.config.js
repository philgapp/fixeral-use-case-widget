const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    devtool: "source-map",
    entry: {
        deliveryApp: "./index.tsx",
    },
    module: {
        rules: [
            {
                loader: "ts-loader",
                test: /\.tsx?$/,
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    },
                    "postcss-loader",
                ],
            },
        ],
    },
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    output: {
        library: "[name]",
        path: path.resolve(__dirname, "build"),
    },
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",
            "create-react-class": "preact-compat/lib/create-react-class",
            "react-dom-factories": "preact-compat/lib/react-dom-factories",
        },
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: "./tsconfig.json",
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            publicPath: "https://delivery-availability.netlify.app/",
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "build"),
    },
};
