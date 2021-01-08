import { Model, Optional } from "sequelize";

export interface Map {
    id: number;
    filename: string;
    description: string;
    mapHardness: number;
    gravity: number;
    tidalStrength: number;
    maxMetal: number;
    extractorRadius: number;
    minWind: number;
    maxWind: number;
    startPositions: Array<{
        x: number;
        z: number;
    }>;
    name?: string;
    shortname?: string;
    author?: string;
    version?: string;
    mapfile?: string;
    modtype?: number;
    notDeformable?: boolean;
    voidWater?: boolean;
    voidGround?: boolean;
    autoShowMetal?: boolean;
}

export interface MapCreationAttributes extends Optional<Map, "id"> { }

export interface MapInstance extends Model<Map, MapCreationAttributes>, Map { }