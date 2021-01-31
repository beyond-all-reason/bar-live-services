import { Module } from "@nuxt/types";
import { Database } from "bar-db";
import { DatabaseSchema } from "bar-db/dist/database";
import express from "express";

import { APIRequestOptions, defaultApiRequestOptions } from "../model/api/request-options";
import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { servicesConfig } from "../services-config";
import { ServicesConfig } from "~/services/services-config";
import { APIResponse, ReplayResponse } from "~/model/api/api-response";

const apiModule: Module = async function () {
    const api = new API(servicesConfig);

    await api.init();

    this.nuxt.hook("close", async () => {
        await api.lobbyService.lobbyClient.disconnect();
    });

    this.nuxt.hook("error", async () => {
        await api.lobbyService.lobbyClient.disconnect();
    });

    this.addServerMiddleware({ path: "/api", handler: api.app });
};

class API {
    public config: ServicesConfig;
    public app: express.Express;
    public db!: DatabaseSchema;
    public leaderboardService!: LeaderboardService;
    public lobbyService!: LobbyService;

    constructor (servicesConfig: ServicesConfig) {
        this.config = servicesConfig;

        this.app = express();
        this.app.use(express.json());
        this.app.use("/maps", express.static(servicesConfig.bardb.mapPath));
        this.app.use("/replays", express.static(servicesConfig.bardb.demoPath));

        this.replays();
        this.players();
        this.maps();
        this.leaderboards();
        this.battles();
    }

    public async init () {
        const db = new Database(this.config.bardb);
        await db.init();
        this.db = db.schema;

        this.leaderboardService = await new LeaderboardService(this.config.leaderboards).init();
        this.lobbyService = await new LobbyService(this.config.lobby).init();
    }

    protected replays () {
        this.app.get("/replays", async (req, res) => {
            const params = this.parseRequestOptions(req.query as { [key: string]: string });

            const { count, rows: replays } = await this.db.demo.findAndCountAll({
                offset: params.page - 1,
                limit: params.limit,
                include: [
                    { model: this.db.map },
                    { model: this.db.allyTeam, include: [this.db.player, this.db.ai] },
                    { model: this.db.spectator }
                ]
            });

            const response: APIResponse<ReplayResponse[]> = {
                totalResults: count,
                page: params.page,
                resultsPerPage: params.limit,
                data: replays as unknown as ReplayResponse[]
            };

            res.json(response);
        });

        this.app.get("/replays/:replayId", async (req, res) => {
            const replay = await this.db.demo.findByPk(req.params.replayId, {
                include: [
                    { model: this.db.map },
                    { model: this.db.allyTeam, include: [this.db.player, this.db.ai] },
                    { model: this.db.spectator }
                ]
            });

            if (replay === null) {
                res.status(404).send("Sorry can't find that!");
                return;
            }

            res.json(replay);
        });
    }

    protected players () {
        this.app.get("/players", async (req, res) => {
            res.send("players");
        });

        this.app.get("/players/:playerId", async (req, res) => {
            res.send(`player: ${req.params.playerId}`);
        });
    }

    protected maps () {
        this.app.get("/maps", async (req, res) => {
            res.send("maps");
        });

        this.app.get("/maps/:mapId", async (req, res) => {
            res.send(`map: ${req.params.mapId}`);
        });
    }

    protected leaderboards () {
        this.app.get("/leaderboards", async (req, res) => {
            res.json(this.leaderboardService.leaderboards);
        });
    }

    protected battles () {
        this.app.get("/battles", async (req, res) => {
            res.json(this.lobbyService.getActiveBattles());
        });
    }

    protected parseRequestOptions (query: { [key: string]: string }) : Required<APIRequestOptions> {
        return {
            page: parseInt(query.page) || defaultApiRequestOptions.page,
            limit: Math.min(parseInt(query.limit), defaultApiRequestOptions.limit) || defaultApiRequestOptions.limit
        };
    }
}

export default apiModule;
