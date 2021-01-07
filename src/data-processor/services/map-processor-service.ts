//import { MapParser } from "spring-map-parser";
import { App } from "app";
import path from "path";
import { promises as fs } from "fs";
import { DemoParser, DemoModel } from "sdfz-demo-parser";
import { FileProcessorService } from "./file-processor-service";

export class MapProcessorService extends FileProcessorService {
    protected mapParser: MapParser;

    constructor(app: App, dir: string) {
        super(app, dir);

        this.demoParser = new DemoParser(this.app.config);
    }

    protected async processFile(filePath: string) {
        const sdfz = await fs.readFile(filePath);
        const demoData = await this.demoParser.parseDemo(sdfz);
        const gameData = demoData.demoStream[0] as DemoModel.Packet.AbstractPacket<DemoModel.Packet.ID.GAMEDATA>;

        const [ map ] = await this.app.db.mapModel.findOrCreate({
            where: { name: demoData.script.gameSettings.mapname },
            defaults: {
                name: demoData.script.gameSettings.mapname,
                checksum: gameData.data.mapChecksum
            }
        });

        const demo = await this.app.db.demoModel.create({
            gameId: demoData.header.gameId,
            fileName: path.basename(filePath),
            engineVersion: demoData.header.versionString,
            gameVersion: demoData.script.gameSettings.gametype,
            startTime: demoData.header.startTime,
            durationMs: demoData.header.gameTime * 1000,
            startPosType: demoData.script.gameSettings.startpostype
        });

        await demo.setMap(map);
    }
}