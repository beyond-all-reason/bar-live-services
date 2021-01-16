import { App } from "app";
import { promises as fs } from "fs";
import * as path from "path";
import { delay } from "utils/delay";

import { Service } from "./service";

export abstract class FileProcessorService extends Service {
    protected dir: string;
    protected fileExt: string;

    constructor(app: App, dir: string, fileExt: string) {
        super(app);

        this.dir = dir;
        this.fileExt = fileExt;
    }

    public async init() {
        await fs.mkdir(`${this.dir}/processed`, { recursive: true });
        await fs.mkdir(`${this.dir}/unprocessed`, { recursive: true });
        await fs.mkdir(`${this.dir}/errored`, { recursive: true });

        return super.init();
    }

    public async processFiles() {
        const fileName = await this.getUnprocessedFile();

        if (fileName) {
            const unprocessedDemoPath = path.join(this.dir, "unprocessed", fileName);
            const processedDemoPath = path.join(this.dir, "processed", fileName);
            const erroredDemoPath = path.join(this.dir, "errored", fileName);

            try {
                this.app.logger.info(`Processing file: ${fileName}`);
                const outPath = await this.processFile(unprocessedDemoPath);
                if (outPath) {
                    await fs.rename(unprocessedDemoPath, path.join(outPath, fileName));
                } else {
                    await fs.rename(unprocessedDemoPath, processedDemoPath);
                }
            } catch (err) {
                console.log(`Failed to process file: ${fileName}.`);
                console.error(err);

                await fs.rename(unprocessedDemoPath, erroredDemoPath);
            }
        } else {
            await delay(this.app.config.filePollMs!);
        }

        this.processFiles();
    }

    protected async processFile(filePath: string) : Promise<string | void> {
        return;
    }

    protected async getUnprocessedFile() : Promise<string | undefined> {
        const unprocessedPath = path.join(this.dir, "unprocessed");
        const files = await fs.readdir(unprocessedPath);
        return files.find(file => path.extname(file) === this.fileExt);
    }
}