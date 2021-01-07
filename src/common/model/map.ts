import { Model, Optional } from "sequelize";

export interface Map {
    id: number;
    name: string;
    checksum: string;
    /*
    shortname: string;
    description: string;
    author: string;
    version: string;
    mutator: string;
    mapfile: string;
    modtype: number;
    depend: object;
    replace: object;
    hardness: number;
    notDeformable: boolean;
    gravity: number;
    tidalStrength: number;
    maxMetal: number;
    extractorRadius: number;
    voidWater: boolean;
    autoShowMetal: boolean;
    minHeight: number;
    maxHeight: number;
    startPositions: Array<{x: number, z: number}>;
    */
}

export interface MapCreationAttributes extends Optional<Map, "id"> { }

export interface MapInstance extends Model<Map, MapCreationAttributes>, Map { }