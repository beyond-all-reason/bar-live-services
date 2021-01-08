import { MapInstance } from "common/model/map";
import * as fs from "fs";
import * as path from "path";
import { DatabaseConfig, DatabaseService } from "services/database-service";
import { DemoProcessorService } from "services/demo-processor-service";
import { LoggerConfig, LoggerService } from "services/logger-service";
import { MapProcessorService } from "services/map-processor-service";
import { delay } from "utils/delay";
import { DemoModel, DemoParser, DemoParserConfig } from "../../../sdfz-demo-parser/dist";

export type AppConfig = LoggerConfig & DatabaseConfig & DemoParserConfig & {
    filePollMs?: number;
};

export const defaultAppConfig: Partial<AppConfig> = {
    verbose: false,
    filePollMs: 5000
}

export class App {
    public config: AppConfig;
    public logger: LoggerService;
    public db: DatabaseService;
    //public demoProcessor: DemoProcessorService;
    public mapProcessor: MapProcessorService;

    constructor(config?: AppConfig) {
        this.config = Object.assign({}, defaultAppConfig, config);

        this.logger = new LoggerService(this);
        this.db = new DatabaseService(this);
        //this.demoProcessor = new DemoProcessorService(this, "demos");
        this.mapProcessor = new MapProcessorService(this, "maps");
    }

    public async init() {
        await this.logger.init();
        await this.db.init();

        //this.demoProcessor.processFiles();

        this.mapProcessor.processFiles();
    }
}

const app = new App({
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "fishfishfish",
    verbose: true
});

app.init();