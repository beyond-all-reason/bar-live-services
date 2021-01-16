import { App } from "app";
import { AIInstance } from "common/model/ai";
import { AliasInstance } from "common/model/alias";
import { AllyTeamInstance } from "common/model/ally-team";
import { DemoInstance } from "common/model/demo";
import { MapInstance } from "common/model/map";
import { PlayerInstance } from "common/model/player";
import { SpectatorInstance } from "common/model/spectator";
import { UserInstance } from "common/model/user";
import { promises as fs } from "fs";
import pg from "pg";
import { DataTypes, ModelCtor, Sequelize } from "sequelize";
import { Service } from "services/service";

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
}

export class DatabaseService extends Service {
    public sequelize!: Sequelize;
    public demoModel!: ModelCtor<DemoInstance>;
    public mapModel!: ModelCtor<MapInstance>;
    public userModel!: ModelCtor<UserInstance>;
    public playerModel!: ModelCtor<PlayerInstance>;
    public spectatorModel!: ModelCtor<SpectatorInstance>;
    public aiModel!: ModelCtor<AIInstance>;
    public allyTeamModel!: ModelCtor<AllyTeamInstance>;
    public aliasModel!: ModelCtor<AliasInstance>;

    constructor(app: App) {
        super(app);
    }

    public async init() {
        await this.initDatabase();
        await this.initSequelize();
        await this.initSchema();

        return super.init();
    }

    protected async initDatabase() {
        const pgClient = new pg.Client({ host: this.app.config.host, port: this.app.config.port, user: this.app.config.username, password: this.app.config.password });
        await pgClient.connect();
        const dbExistsQuery = await pgClient.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'bar';");
        const dbExists = dbExistsQuery.rowCount > 0;
        if (!dbExists) {
            await pgClient.query("CREATE DATABASE bar");
            this.app.logger.info("bar database created.");
        }
        await pgClient.end();
    }

    protected async initSequelize() {
        this.sequelize = new Sequelize({
            //logging: console.log,
            logging: false,
            dialect: "postgres",
            host: this.app.config.host,
            port: this.app.config.port,
            username: this.app.config.username,
            password: this.app.config.password,
            database: "bar"
        });

        try {
            await this.sequelize.authenticate();
            this.app.logger.info("Connection has been established successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    protected async initSchema() {
        this.mapModel = this.sequelize.define<MapInstance>("Map", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            scriptName: { type: DataTypes.STRING, allowNull: false },
            fileName: { type: DataTypes.STRING },
            description: { type: DataTypes.STRING },
            mapHardness: { type: DataTypes.FLOAT },
            gravity: { type: DataTypes.FLOAT },
            tidalStrength: { type: DataTypes.FLOAT },
            maxMetal: { type: DataTypes.FLOAT },
            extractorRadius: { type: DataTypes.FLOAT },
            minWind: { type: DataTypes.FLOAT },
            maxWind: { type: DataTypes.FLOAT },
            startPositions: { type: DataTypes.JSON },
            width: { type: DataTypes.INTEGER },
            height: { type: DataTypes.INTEGER },
            minDepth: { type: DataTypes.INTEGER },
            maxDepth: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            shortname: { type: DataTypes.STRING },
            author: { type: DataTypes.STRING },
            version: { type: DataTypes.STRING },
            mapfile: { type: DataTypes.STRING },
            modtype: { type: DataTypes.INTEGER },
            notDeformable: { type: DataTypes.BOOLEAN },
            voidWater: { type: DataTypes.BOOLEAN },
            voidGround: { type: DataTypes.BOOLEAN },
            autoShowMetal: { type: DataTypes.BOOLEAN },
        });

        this.demoModel = this.sequelize.define<DemoInstance>("Demo", {
            id: { type: DataTypes.STRING, primaryKey: true },
            fileName: { type: DataTypes.STRING, unique: true },
            engineVersion: { type: DataTypes.STRING },
            gameVersion: { type: DataTypes.STRING },
            startTime: { type: DataTypes.DATE },
            durationMs: { type: DataTypes.INTEGER },
            fullDurationMs: { type: DataTypes.INTEGER },
            hostSettings: { type: DataTypes.JSON },
            gameSettings: { type: DataTypes.JSON },
            mapSettings: { type: DataTypes.JSON },
        });

        this.allyTeamModel = this.sequelize.define<AllyTeamInstance>("AllyTeam", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            allyTeamId: { type: DataTypes.INTEGER },
            startBox: { type: DataTypes.JSON },
            winningTeam: { type: DataTypes.BOOLEAN }
        });

        this.playerModel = this.sequelize.define<PlayerInstance>("Player", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            playerId: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            teamId: { type: DataTypes.INTEGER },
            handicap: { type: DataTypes.INTEGER },
            faction: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rgbColor: { type: DataTypes.JSON },
            rank: { type: DataTypes.INTEGER },
            skillUncertainty: { type: DataTypes.INTEGER },
            skill: { type: DataTypes.STRING },
        });

        this.spectatorModel = this.sequelize.define<SpectatorInstance>("Spectator", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            playerId: { type: DataTypes.INTEGER },
            name: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rank: { type: DataTypes.INTEGER },
            skillUncertainty: { type: DataTypes.INTEGER },
            skill: { type: DataTypes.STRING }
        });

        this.aiModel = this.sequelize.define<AIInstance>("AI", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            aiId: { type: DataTypes.INTEGER },
            shortName: { type: DataTypes.STRING },
            name: { type: DataTypes.STRING },
            host: { type: DataTypes.BOOLEAN }
        });

        this.userModel = this.sequelize.define<UserInstance>("User", {
            id: { type: DataTypes.INTEGER, primaryKey: true },
            username: { type: DataTypes.STRING },
            countryCode: { type: DataTypes.STRING },
            rank: { type: DataTypes.INTEGER },
            skill: { type: DataTypes.STRING },
            skillUncertainty: { type: DataTypes.FLOAT },
        });

        this.aliasModel = this.sequelize.define<AliasInstance>("Alias", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            alias: { type: DataTypes.STRING }
        });

        this.mapModel.hasMany(this.demoModel, { foreignKey: "mapId" });
        this.demoModel.belongsTo(this.mapModel, { foreignKey: "mapId" });

        this.demoModel.hasMany(this.allyTeamModel, { foreignKey: "demoId", onDelete: "CASCADE" });
        this.allyTeamModel.belongsTo(this.demoModel, { foreignKey: "demoId" });

        this.demoModel.hasMany(this.spectatorModel, { foreignKey: "demoId", onDelete: "CASCADE" });
        this.spectatorModel.belongsTo(this.demoModel, { foreignKey: "demoId" });

        this.allyTeamModel.hasMany(this.playerModel, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        this.playerModel.belongsTo(this.allyTeamModel, { foreignKey: "allyTeamId" });

        this.allyTeamModel.hasMany(this.aiModel, { foreignKey: "allyTeamId", onDelete: "CASCADE" });
        this.aiModel.belongsTo(this.allyTeamModel, { foreignKey: "allyTeamId" });

        this.userModel.hasMany(this.playerModel, { foreignKey: "userId", onDelete: "CASCADE" });
        this.playerModel.belongsTo(this.userModel, { foreignKey: "userId" });

        this.userModel.hasMany(this.aliasModel, { foreignKey: "userId", onDelete: "CASCADE" });
        this.aliasModel.belongsTo(this.userModel, { foreignKey: "userId" });

        this.userModel.hasMany(this.spectatorModel, { foreignKey: "userId", onDelete: "CASCADE" });
        this.spectatorModel.belongsTo(this.userModel, { foreignKey: "userId" });

        await this.mapModel.sync({ alter: true });
        await this.userModel.sync({ alter: true });
        await this.demoModel.sync({ alter: true });
        await this.allyTeamModel.sync({ alter: true });
        await this.playerModel.sync({ alter: true });
        await this.spectatorModel.sync({ alter: true });
        await this.aiModel.sync({ alter: true });
        await this.aliasModel.sync({ alter: true });

        const sequelizeErd = require("sequelize-erd");
        const svg = await sequelizeErd({ source: this.sequelize });
        await fs.writeFile("./src/data-processor/db-schema.svg", svg);

        //console.log(this.demoModel.prototype);

        this.app.logger.info("Demo schema created");
    }
}