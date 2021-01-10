import { App } from "app";
import path from "path";
import { promises as fs } from "fs";
import { DemoParser, DemoModel } from "sdfz-demo-parser";
import { FileProcessorService } from "./file-processor-service";
import { MapParser } from "spring-map-parser";

export class MapProcessorService extends FileProcessorService {
    protected mapParser: MapParser;

    constructor(app: App, dir: string) {
        super(app, dir, ".sd7");

        this.mapParser = new MapParser({ mipmapSize: 4 });
    }

    protected async processFile(filePath: string) {
        const mapData = await this.mapParser.parseMap(filePath);

        const destDir = `${this.dir}/processed/${mapData.fileName}`;
        await fs.mkdir(destDir, { recursive: true });

        await mapData.heightMap.toFile(`${destDir}/height.png`);
        await mapData.metalMap.toFile(`${destDir}/metal.png`);
        await mapData.typeMap.toFile(`${destDir}/type.png`);
        await mapData.textureMap!.toFile(`${destDir}/texture.png`);

        const newMap = {
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
        };

        const storedMap = await this.app.db.mapModel.findOne({ where: { scriptName: mapData.scriptName } });
        
        if (storedMap) {
            await storedMap.update(newMap);
        } else {
            await this.app.db.mapModel.create(newMap);
        }

        return destDir;
    }
}