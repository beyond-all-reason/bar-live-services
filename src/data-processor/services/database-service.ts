import pg from "pg";
import { Sequelize, DataTypes, ModelCtor } from "sequelize";
import { Demo, DemoInstance } from "common/model/demo";
import { Map, MapInstance } from "common/model/map";
import { Service } from "services/service";
import { App } from "app";
import { UserInstance } from "common/model/user";
import { PlayerInstance } from "common/model/player";

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
        const pgClient = new pg.Client({ host: this.app.config.host, port: this.app.config.port, user: this.app.config.username, password: this.app.config.password })
        await pgClient.connect();
        const dbExistsQuery = await pgClient.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'bar';");
        const dbExists = dbExistsQuery.rowCount > 0;
        if (!dbExists){
            await pgClient.query("CREATE DATABASE bar");
            this.app.logger.info(`bar database created.`);
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
            this.app.logger.info('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }

    protected async initSchema() {
        this.demoModel = this.sequelize.define<DemoInstance>("Demo", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            gameId: { type: DataTypes.STRING, unique: true, allowNull: false },
            fileName: { type: DataTypes.STRING, unique: true, allowNull: false },
            engineVersion: { type: DataTypes.STRING, allowNull: false },
            gameVersion: { type: DataTypes.STRING, allowNull: false },
            startTime: { type: DataTypes.DATE, allowNull: false },
            durationMs: { type: DataTypes.INTEGER, allowNull: false },
            startPosType: { type: DataTypes.INTEGER, allowNull: false }
        });

        this.mapModel = this.sequelize.define<MapInstance>("Map", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            filename: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },
            mapHardness: { type: DataTypes.NUMBER, allowNull: false },
            gravity: { type: DataTypes.NUMBER, allowNull: false },
            tidalStrength: { type: DataTypes.NUMBER, allowNull: false },
            maxMetal: { type: DataTypes.NUMBER, allowNull: false },
            extractorRadius: { type: DataTypes.NUMBER, allowNull: false },
            minWind: { type: DataTypes.NUMBER, allowNull: false },
            maxWind: { type: DataTypes.NUMBER, allowNull: false },
            startPositions: { type: DataTypes.JSON, allowNull: false },
            name: { type: DataTypes.STRING },
            shortname: { type: DataTypes.STRING },
            author: { type: DataTypes.STRING },
            version: { type: DataTypes.STRING },
            mapfile: { type: DataTypes.STRING },
            modtype: { type: DataTypes.NUMBER },
            notDeformable: { type: DataTypes.BOOLEAN },
            voidWater: { type: DataTypes.BOOLEAN },
            voidGround: { type: DataTypes.BOOLEAN },
            autoShowMetal: { type: DataTypes.BOOLEAN },
        });

        this.mapModel.hasMany(this.demoModel, { foreignKey: "mapId" });
        this.demoModel.belongsTo(this.mapModel, { foreignKey: "mapId" });

        await this.mapModel.sync({ alter: true });
        await this.demoModel.sync({ alter: true });

        this.app.logger.info("Demo schema created");
    }
}