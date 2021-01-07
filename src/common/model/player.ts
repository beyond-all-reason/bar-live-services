import { Model, Optional } from "sequelize";

export interface Player {
    id: number;
}

export interface PlayerCreationAttributes extends Optional<Player, "id"> { }

export interface PlayerInstance extends Model<Player, PlayerCreationAttributes>, Player { }