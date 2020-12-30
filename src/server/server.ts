import webpackConfig from "../../webpack.config";
import express from "express";
import webpack, { Configuration } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { Player } from "common/model/player";
import { router } from "controllers";

export interface ServerConfig {
    port: number;
    isDev: boolean;
}

export class Server {
    public app: express.Application;

    protected config: ServerConfig;

    constructor(config: ServerConfig = { port: 4086, isDev: false }) {
        this.config = config;

        this.app = express();

        //this.app.set("view engine", "ejs");
        //this.app.set("views", "dist/client");

        if (this.config.isDev){
            const clientWebpackConfig = webpackConfig(this.config.isDev ? "dev" : "prod")[0];
            clientWebpackConfig.stats = "minimal";
            const compiler = webpack(clientWebpackConfig);
            this.app.use(webpackDevMiddleware(compiler, {
                publicPath: clientWebpackConfig.output?.publicPath
            }));
            this.app.use(webpackHotMiddleware(compiler, { log: false }));
        }

        this.app.use(express.static("dist/client"));

        this.app.use(router);
    }

    public async start() {
        return new Promise<void>(resolve => {
            this.app.listen(this.config.port, () => {
                console.log(`Server running at http://localhost:${this.config.port}`);
                resolve();
            });
        });
    }
}