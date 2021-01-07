import { Model, Optional } from "sequelize";

export interface User {
    id: number;
}

export interface UserCreationAttributes extends Optional<User, "id"> { }

export interface UserInstance extends Model<User, UserCreationAttributes>, User { }