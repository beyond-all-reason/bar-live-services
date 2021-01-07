import { Model, Optional } from "sequelize";
import { MapInstance } from "./map";

export interface Demo {
    id: number;
    gameId: string;
    fileName: string;
    engineVersion: string;
    gameVersion: string;
    //mapId: number;
    startTime: Date;
    durationMs: number;
    startPosType: number;
}

export interface DemoCreationAttributes extends Optional<Demo, "id"> { }

export interface DemoInstance extends Model<Demo, DemoCreationAttributes>, Demo {
    setMap: (map: MapInstance) => Promise<DemoInstance>;
    getMap: () => Promise<MapInstance>;
    createMap: (map: MapInstance) => Promise<DemoInstance>;
}