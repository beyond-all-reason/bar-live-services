import { App } from "app";
import { Service } from "./service";

export interface LoggerConfig {
    verbose?: boolean;
}

export class LoggerService extends Service {
    constructor(app: App) {
        super(app);
    }

    public info(...data: any[]) {
        if (this.app.config.verbose) {
            console.info(...data);
        }
    }
}