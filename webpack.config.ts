import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import * as webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackNodeExternals from "webpack-node-externals";

export const clientConfig: (env: "dev" | "prod") => WebpackDevServer.Configuration & webpack.Configuration = (env) => {
    const isDev = env === "dev";

    return {
        name: "client",
        mode: isDev ? "development" : "production",
        watch: isDev,
        devtool: "source-map",
        target: "web",
        entry: {
            app: isDev ? ["webpack-hot-middleware/client?reload=true&quiet=true", "./src/client/ts/app.ts"] : ["./src/client/ts/app.ts"]
        },
        output: {
            path: path.resolve(__dirname, "dist/client"),
            filename: "[name].js",
            publicPath: ""
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".vue"],
            alias: {
                "vue$": "vue/dist/vue.esm.js"
            },
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: "src/client/ts/tsconfig.json"
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        configFile: "src/client/ts/tsconfig.json",
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: { url: false }
                        },
                        "sass-loader"
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist/client/**/*")],
                protectWebpackAssets: true,
                cleanStaleWebpackAssets: false
            }),
            new webpack.HotModuleReplacementPlugin(),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: "src/client/dom/index.html",
                filename: "index.html"
            }),
            new CopyPlugin({
                patterns: [
                    { from: "src/client/images", to: "images" },
                    //{ from: "src/client/fonts", to: "fonts" },
                ]
            }),
            new webpack.DefinePlugin({
                __IS_DEV__: JSON.stringify(isDev)
            }),
            isDev ? () => { } : new MiniCssExtractPlugin(),
        ]
    };
};

export const serverConfig: (env: "dev" | "prod") => webpack.Configuration = (env) => {
    const isDev = env === "dev";

    return {
        name: "server",
        mode: isDev ? "development" : "production",
        watch: isDev,
        devtool: "source-map",
        target: "node",
        node: {
            __dirname: true,
            __filename: true
        },
        externals: [webpackNodeExternals()],
        entry: {
            app: path.resolve(__dirname, "src/server/app.ts"),
        },
        output: {
            path: path.resolve(__dirname, "dist/server"),
            filename: "[name].js",
            libraryTarget: "commonjs2"
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: "src/server/tsconfig.json"
                }),
            ],
            modules: [
                path.resolve(__dirname, "node_modules"),
                path.resolve(__dirname, "src/server")
            ],
            alias: {
                common: path.resolve(__dirname, "src/common")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "src/server/tsconfig.json")
                        }
                    }],
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist/server/**/*")]
            }),
            new webpack.DefinePlugin({
                __IS_DEV__: JSON.stringify(isDev)
            }),
            new VueLoaderPlugin(),
            //new VueSSRServerPlugin()
        ]
    };
};

export const dataProcessorConfig: (env: "dev" | "prod") => webpack.Configuration = (env) => {
    const isDev = env === "dev";

    return {
        name: "data-processor",
        mode: isDev ? "development" : "production",
        watch: isDev,
        devtool: "source-map",
        target: "node",
        node: {
            __dirname: true,
            __filename: true
        },
        externals: [webpackNodeExternals()],
        entry: {
            app: path.resolve(__dirname, "src/data-processor/app.ts"),
        },
        output: {
            path: path.resolve(__dirname, "dist/data-processor"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".js", ".ts"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: "src/data-processor/tsconfig.json"
                }),
            ],
            modules: [
                path.resolve(__dirname, "node_modules"),
                path.resolve(__dirname, "src/data-processor")
            ],
            alias: {
                common: path.resolve(__dirname, "src/common")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "src/data-processor/tsconfig.json")
                        }
                    }],
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist/data-processor/**/*")]
            }),
            new webpack.DefinePlugin({
                __IS_DEV__: JSON.stringify(isDev)
            })
        ]
    };
};

export default (env: "dev" | "prod") => {
    return [
        clientConfig(env),
        serverConfig(env),
        dataProcessorConfig(env)
    ];
};