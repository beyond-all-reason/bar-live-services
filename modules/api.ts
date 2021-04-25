import * as fs from "fs";
import { Module } from "@nuxt/types";
import { Database } from "bar-db";
import { Demo } from "bar-db/dist/model/demo";
import { DatabaseSchema } from "bar-db/dist/database";
import express from "express";
import _, { filter } from "lodash";
import { Writeable } from "jaz-ts-utils";
import { AndOperator, Op, OrderItem, OrOperator, WhereAttributeHash } from "sequelize";

import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { APIResponse, ReplayResponse } from "../model/api/api-response";
import Config from "../config-example.json";
import { defaultReplaySorts, ReplayFilters, ReplayRequest } from "../model/api/replays";
import { defaultPaginatedRequest } from "../model/api/paginated-request";
import { parseReplayFilters } from "../modules/api/replays";

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
    public barDb!: Database;
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
        this.users();
        this.cachedUsers();
        this.cachedMaps();
    }

    public async init () {
        this.barDb = new Database({ ...this.config.bardb, syncModel: false, initMemoryStore: false });

        await this.barDb.init();

        this.leaderboardService = await new LeaderboardService(this.config.leaderboards).init();
        this.lobbyService = await new LobbyService(this.config.lobby, this.barDb).init();
    }

    protected replays () {
        this.app.get("/replays", async (req, res) => {
            const { filters, sort, limit, page } = this.parseReplaysRequestQuery(req.query as { [key: string]: string });

            const order = Object.entries(sort).map(([key, sortType]) => [key, sortType.toUpperCase()]) as OrderItem[];

            const where: WhereAttributeHash<Demo> | AndOperator<Demo> | OrOperator<Demo> = {
                ...(filters.preset !== undefined ? { preset: filters.preset } : {}),
                ...(filters.hasBots !== undefined ? { hasBots: filters.hasBots } : {}),
                ...(filters.endedNormally !== undefined ? { gameEndedNormally: filters.endedNormally } : {}),
                ...(filters.reported !== undefined ? { reported: filters.reported } : {}),
            };

            console.log(where);

            const optionalFilters: any = {};
            if (filters.reported !== undefined) {
                optionalFilters.reported = filters.reported;
            }

            const result = await this.barDb.schema.demo.findAndCountAll({
                offset: (page - 1) * limit,
                limit: limit,
                order,
                attributes: ["id", "startTime", "durationMs", "hostSettings"],
                distinct: true,
                include: [
                    { model: this.barDb.schema.map, attributes: ["fileName"] },
                    {
                        model: this.barDb.schema.allyTeam, // TODO: only include total player counts instead of objects
                        attributes: ["allyTeamId"],
                        include: [
                            { model: this.barDb.schema.player, attributes: ["userId", "playerId", "name"] },
                            { model: this.barDb.schema.ai, attributes: ["shortName"] }
                        ]
                    },
                    { model: this.barDb.schema.spectator, attributes: ["userId", "playerId", "name"] }
                ],
                where
            });

            const response: APIResponse<ReplayResponse[]> = {
                totalResults: result.count,
                page: page,
                resultsPerPage: limit,
                filters: filters,
                sorts: sort,
                data: result.rows as unknown as ReplayResponse[]
            };

            res.json(response);
        });

        this.app.get("/replays/:replayId", async (req, res) => {
            const replay = await this.barDb.schema.demo.findByPk(req.params.replayId, {
                include: [
                    { model: this.barDb.schema.map },
                    {
                        model: this.barDb.schema.allyTeam,
                        include: [this.barDb.schema.player, this.barDb.schema.ai],
                        separate: true,
                        order: [["allyTeamId", "ASC"]]
                    },
                    { model: this.barDb.schema.spectator }
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

    protected users() {
        this.app.get("/users", async (req, res) => {
            const result = await this.barDb.schema.user.findAll({
                attributes: ["username", "countryCode"]
            });

            return res.json(result);
        });
    }

    protected cachedUsers() {
        this.app.get("/cached-users", async (req, res) => {
            const cachedUsers = await this.barDb.getUsersFromMemory();

            res.setHeader('Content-Type', 'application/json');

            return res.end(cachedUsers);
        });
    }

    protected cachedMaps() {
        this.app.get("/cached-maps", async (req, res) => {
            const cachedMaps = await this.barDb.getMapsFromMemory();

            res.setHeader('Content-Type', 'application/json');

            return res.end(cachedMaps);
        });
    }

    protected parseReplaysRequestQuery (query: { [key: string]: string }) : Required<ReplayRequest> {
        const filters = parseReplayFilters(query);

        const sorts: Writeable<typeof defaultReplaySorts> = _.clone(defaultReplaySorts);
        for (const key in query) {
            const val = query[key];
            if (key in sorts) {
                sorts[key] = val === "asc" ? "asc" : "desc";
            }
        }

        return {
            page: parseInt(query.page) || defaultPaginatedRequest.page,
            limit: Math.min(parseInt(query.limit), defaultPaginatedRequest.limit) || defaultPaginatedRequest.limit,
            filters,
            sort: sorts
        };
    }
}

export default apiModule;
