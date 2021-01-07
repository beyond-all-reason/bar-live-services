import { App } from "app";

export abstract class Service {
    protected app: App;

    constructor(app: App) {
        this.app = app;
    }

    public async init() : Promise<this> {
        return this;
    }
}