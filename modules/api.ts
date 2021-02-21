import * as fs from "fs";
import { Module } from "@nuxt/types";
import { Database } from "bar-db";
import { DatabaseSchema } from "bar-db/dist/database";
import express from "express";
import _ from "lodash";
import { Writeable } from "jaz-ts-utils";

import { APIRequestOptions, defaultApiRequestOptions } from "../model/api/request-options";
import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { APIResponse, ReplayResponse } from "../model/api/api-response";
import Config from "../config-example.json";
import { Op, OrderItem, Sequelize } from "sequelize";
import { defaultReplayFilters, defaultReplaySorts, ReplayRequest } from "../model/api/replays";

export type ServicesConfig = typeof Config;

const apiModule: Module = async function () {
    if (!(this.options.dev || this.options._start)) {
        return;
    }

    if (!fs.existsSync("config.json")) {
        throw new Error("You must provide a config.json file, check config-example.json");
    }

    const config = JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" }));

    const api = new API(config);

    await api.init();

    this.nuxt.hook("close", async () => {
        await api.lobbyService.lobbyClient.disconnect();
    });

    this.nuxt.hook("error", async () => {
        await api.lobbyService.lobbyClient.disconnect();
    });

    this.addServerMiddleware({ path: "/api", handler: api.app });
};

export class API {
    public config: ServicesConfig;
    public app: express.Express;
    public db!: DatabaseSchema;
    public leaderboardService!: LeaderboardService;
    public lobbyService!: LobbyService;

    constructor (servicesConfig: ServicesConfig) {
        this.config = servicesConfig;

        this.app = express();
        this.app.use(express.json());
        if (process.env.NODE_ENV !== "production") {
            this.app.set("json spaces", 4);
        }
        this.app.use("/maps", express.static(servicesConfig.bardb.mapPath));
        this.app.use("/replays", express.static(servicesConfig.bardb.demoPath));

        this.replays();
        this.players();
        this.maps();
        this.leaderboards();
        this.battles();
    }

    public async init () {
        const db = new Database({ ...this.config.bardb, syncModel: false });
        await db.init();
        this.db = db.schema;

        this.leaderboardService = await new LeaderboardService(this.config.leaderboards).init();
        this.lobbyService = await new LobbyService(this.config.lobby, db).init();
    }

    protected replays () {
        this.app.get("/replays", async (req, res) => {
            const query = this.parseReplaysRequestQuery(req.query as { [key: string]: string });

            const order = Object.entries(query.sort).map(([key, sortType]) => [key, sortType.toUpperCase()]) as OrderItem[];

            const presets: string[] = [];
            for (const preset of ["duel", "team", "ffa"]) {
                if (query.filters[preset]) {
                    presets.push(preset);
                }
            }

            const result = await this.db.demo.findAndCountAll({
                offset: (query.page - 1) * query.limit,
                limit: query.limit,
                order,
                attributes: ["id", "startTime", "durationMs", "hostSettings"],
                distinct: true,
                include: [
                    { model: this.db.map, attributes: ["fileName"] },
                    {
                        model: this.db.allyTeam, // TODO: only include total player counts instead of objects
                        attributes: ["allyTeamId"],
                        include: [
                            { model: this.db.player, attributes: ["userId", "playerId", "name"] },
                            { model: this.db.ai, attributes: ["shortName"] }
                        ]
                    },
                    { model: this.db.spectator, attributes: ["userId", "playerId", "name"] }
                ],
                where: {
                    hasBots: query.filters.bots,
                    gameEndedNormally: query.filters.endedNormally,
                    preset: {
                        [Op.or]: presets
                    }
                }
            });

            const response: APIResponse<ReplayResponse[]> = {
                totalResults: result.count,
                page: query.page,
                resultsPerPage: query.limit,
                filters: query.filters,
                sorts: query.sort,
                data: result.rows as unknown as ReplayResponse[]
            };

            res.json(response);
        });

        this.app.get("/replays/:replayId", async (req, res) => {
            const replay = await this.db.demo.findByPk(req.params.replayId, {
                include: [
                    { model: this.db.map },
                    {
                        model: this.db.allyTeam,
                        include: [this.db.player, this.db.ai],
                        separate: true,
                        order: [["allyTeamId", "ASC"]]
                    },
                    { model: this.db.spectator }
                ]
            });

            if (replay === null) {
                res.status(404).send("Replay not found");
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
            res.json(this.lobbyService.activeBattles);
        });
    }

    protected parseReplaysRequestQuery (query: { [key: string]: string }) : Required<ReplayRequest> {
        const filters: Writeable<typeof defaultReplayFilters> = _.clone(defaultReplayFilters);
        for (const key in query) {
            const val = query[key];
            if (key in filters) {
                filters[key] = val === "true";
            }
        }

        const sorts: Writeable<typeof defaultReplaySorts> = _.clone(defaultReplaySorts);
        for (const key in query) {
            const val = query[key];
            if (key in sorts) {
                sorts[key] = val === "asc" ? "asc" : "desc";
            }
        }

        return {
            page: parseInt(query.page) || defaultApiRequestOptions.page,
            limit: Math.min(parseInt(query.limit), defaultApiRequestOptions.limit) || defaultApiRequestOptions.limit,
            filters: filters,
            sort: sorts
        };
    }
}

export default apiModule;
