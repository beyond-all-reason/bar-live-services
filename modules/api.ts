import { Module } from "@nuxt/types";
import express from "express";
import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { Database } from "bar-db";
import { servicesConfig } from "../services-config";
import { Data } from "ws";
import { APIRequestOptions, defaultApiRequestOptions } from "../model/api/request-options";
import { DatabaseSchema } from "bar-db/dist/database";

const apiModule: Module = async function () {
    //const leaderboardService = await new LeaderboardService(servicesConfig.leaderboards).init();
    //const lobbyService = await new LobbyService(servicesConfig.lobby).init();

    const db = new Database(servicesConfig.bardb);

    await db.init();

    const api = new API(db.schema);

    this.addServerMiddleware({ path: "/api", handler: api.app });
}

class API {
    public app: express.Express;
    public db: DatabaseSchema;

    constructor(db: DatabaseSchema) {
        this.db = db;

        this.app = express();
        this.app.use(express.json());
    }

    protected replays() {
        this.app.get("/replays", async (req, res) => {
            const params = this.parseRequestOptions(req.query as { [key: string]: string });
    
            const replays = await this.db.demo.findAll({
                offset: params.page - 1,
                limit: params.limit,
                attributes: {
                    exclude: ["gameSettings", "mapSettings"],
                },
                include: this.db.allyTeam
            });
    
            res.json(replays);
        });
    
        this.app.get("/replays/:replayId", async (req, res) => {
            res.send(`replay: ${req.params.replayId}`);
        });
    }
    
    protected players() {
        this.app.get("/players", async (req, res) => {
            res.send(`players`);
        });
    
        this.app.get("/players/:playerId", async (req, res) => {
            res.send(`player: ${req.params.playerId}`);
        });
    }
    
    protected maps() {
        this.app.get("/maps", async (req, res) => {
            res.send(`maps`);
        });
    
        this.app.get("/maps/:mapId", async (req, res) => {
            res.send(`map: ${req.params.mapId}`);
        });
    }
    
    protected leaderboards() {
        this.app.get("/leaderboards", async (req, res) => {
            res.send(`leaderboards`);
        });
    }
    
    protected battles() {
        this.app.get("/battles", async (req, res) => {
            res.send(`battles`);
        });
    }
    
    protected parseRequestOptions(query: { [key: string]: string }) : Required<APIRequestOptions> {
        return {
            page: parseInt(query.page) ?? defaultApiRequestOptions.page,
            limit: Math.min(parseInt(query.limit), defaultApiRequestOptions.limit) ?? defaultApiRequestOptions.limit,
        }
    }
}

export default apiModule;