import { App } from "app";
import path from "path";
import { promises as fs } from "fs";
import { DemoParser, DemoModel } from "sdfz-demo-parser";
import { FileProcessorService } from "./file-processor-service";
import { MapParser } from "spring-map-parser";

export class MapProcessorService extends FileProcessorService {
    protected mapParser: MapParser;

    constructor(app: App, dir: string) {
        super(app, dir);

        this.mapParser = new MapParser(this.app.config);
    }

    protected async processFile(filePath: string) {
        const mapData = await this.mapParser.parseMap(filePath);

        const folder = await fs.mkdir(`${this.dir}/processed/${mapData.fileName}`, { recursive: true });

        await mapData.heightMap.toFile(`${folder}/height.png`);
        await mapData.metalMap.toFile(`${folder}/metal.png`);
        await mapData.typeMap.toFile(`${folder}/type.png`);
        await mapData.miniMap.toFile(`${folder}/mini.png`);
        await mapData.textureMap!.toFile(`${folder}/texture.png`);

        const map = await this.app.db.mapModel.create({
            fileName: mapData.fileName,
            scriptName: mapData.scriptName,
            description: mapData.info.description,
            mapHardness: mapData.info.mapHardness,
            gravity: mapData.info.gravity,
            tidalStrength: mapData.info.tidalStrength,
            maxMetal: mapData.info.maxMetal,
            extractorRadius: mapData.info.extractorRadius,
            minWind: mapData.info.minWind,
            maxWind: mapData.info.maxWind,
            startPositions: mapData.info.startPositions,
            width: mapData.meta.mapWidthUnits * 2,
            height: mapData.meta.mapHeightUnits * 2,
            minDepth: mapData.meta.minDepth,
            maxDepth: mapData.meta.maxDepth,
            name: mapData.info.name,
            shortname: mapData.info.shortname,
            author: mapData.info.author,
            version: mapData.info.version,
            mapfile: mapData.info.mapfile,
            modtype: mapData.info.modtype,
            notDeformable: mapData.info.notDeformable,
            voidWater: mapData.info.voidWater,
            voidGround: mapData.info.voidGround,
            autoShowMetal: mapData.info.autoShowMetal,
        });

        return folder;
    }
}