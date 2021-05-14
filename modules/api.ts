import * as fs from "fs";
import { Module } from "@nuxt/types";
import { Database } from "bar-db";
import { Demo } from "bar-db/dist/model/demo";
import { Map } from "bar-db/dist/model/map";
import express from "express";
import { AndOperator, Op, OrderItem, OrOperator, Sequelize, WhereAttributeHash } from "sequelize";

import _ from "lodash";
import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { APIResponse, ReplayResponse } from "../model/api/api-response";
import Config from "../config-example.json";
import { parseReplaysRequestQuery } from "../modules/api/replays";
import { defaultReplayFilters } from "../model/api/replays";

export type ServicesConfig = typeof Config;

const apiModule: Module = async function() {
    if (!(this.options.dev || this.options._start)) {
        return;
    }

    if (!fs.existsSync("config.json")) {
        throw new Error("You must provide a config.json file, check config-example.json");
    }

    const config = JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" }));

    const api = new API(config);

    await api.init();

    this.nuxt.hook("close", async() => {
        await api.lobbyService.lobbyClient.disconnect();
    });

    this.nuxt.hook("error", async() => {
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

    constructor(servicesConfig: ServicesConfig) {
        this.config = servicesConfig;

        this.app = express();
        this.app.use(express.json());
        if (process.env.NODE_ENV !== "production") {
            this.app.set("json spaces", 4);
        }
        this.app.use("/maps", express.static(servicesConfig.bardb.mapPath));
        this.app.use("/replays", express.static(servicesConfig.bardb.demoPath));

        const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
            res.status(500);
            res.send("error");
            console.log(err);
        };
        this.app.use(errorHandler);

        this.replays();
        this.replay();
        this.players();
        this.maps();
        this.leaderboards();
        this.battles();
        this.users();
        this.cachedUsers();
        this.cachedMaps();
        this.test();
    }

    public async init() {
        this.barDb = new Database({ ...this.config.bardb, syncModel: false, initMemoryStore: false, logSQL: false });

        await this.barDb.init();

        this.leaderboardService = await new LeaderboardService(this.config.leaderboards).init();
        this.lobbyService = await new LobbyService(this.config.lobby, this.barDb).init();
    }

    protected replays() {
        this.app.get("/replays", async(req, res, next) => {
            const { filters, sort, limit, page } = parseReplaysRequestQuery(req.query as { [key: string]: string });

            const demoWhere: WhereAttributeHash<Demo> | AndOperator<Demo> | OrOperator<Demo> = {};
            const mapWhere: WhereAttributeHash<Map> | AndOperator<Map> | OrOperator<Map> = {};

            filters.preset !== undefined && (demoWhere.preset = filters.preset);
            filters.hasBots !== undefined && (demoWhere.hasBots = filters.hasBots);
            filters.endedNormally !== undefined && (demoWhere.gameEndedNormally = filters.endedNormally);
            filters.reported !== undefined && (demoWhere.reported = filters.reported);
            filters.maps !== undefined && filters.maps.length && (mapWhere.scriptName = { [Op.or]: filters.maps });
            if (filters.dateRange !== undefined && filters.dateRange.length) {
                const dates = filters.dateRange.map(str => new Date(str)).sort((a, b) => a.valueOf() - b.valueOf());
                if (dates.length === 1) {
                    dates.unshift(_.clone(dates[0]));
                }
                const lastDate = dates[dates.length - 1];
                lastDate.setDate(lastDate.getDate() + 1);
                filters.dateRange !== undefined && (demoWhere.startTime = { [Op.between]: dates.map(date => date.toISOString()) });
            }

            filters.durationRangeMins !== undefined && filters.durationRangeMins.length &&
                !_.isEqual(filters.durationRangeMins, defaultReplayFilters.durationRangeMins) &&
                (demoWhere.durationMs = { [Op.between]: filters.durationRangeMins.map(ms => ms * 1000 * 60) });

            const demoIds: string[][] = [];

            if (filters.tsRange !== undefined && filters.tsRange.length && !_.isEqual(filters.tsRange, defaultReplayFilters.tsRange)) {
                const tsRangeDemoIds = await this.getTrueSkillDemoIds(filters.tsRange[0], filters.tsRange[1]);
                demoIds.push(tsRangeDemoIds);
            }

            if (filters.players !== undefined && filters.players.length) {
                const playerDemoIds = await this.getPlayerDemoIds(filters.players);
                demoIds.push(playerDemoIds);
            }

            if (demoIds.length) {
                demoWhere.id = {
                    [Op.and]: demoIds.map((ids) => { return { [Op.in]: ids }; })
                };
            }

            console.log(demoWhere);

            const order = Object.entries(sort).map(([key, sortType]) => [key, sortType.toUpperCase()]) as OrderItem[];

            const result = await this.barDb.schema.demo.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
                order,
                attributes: ["id", "startTime", "durationMs"],
                distinct: true,
                include: [
                    {
                        model: this.barDb.schema.map,
                        attributes: ["fileName", "scriptName"],
                        where: mapWhere,
                        subQuery: false
                    },
                    {
                        model: this.barDb.schema.allyTeam, // TODO: only include total player counts instead of objects
                        attributes: ["winningTeam"],
                        include: [
                            {
                                model: this.barDb.schema.player,
                                attributes: ["name"],
                                subQuery: false
                            },
                            {
                                model: this.barDb.schema.ai,
                                attributes: ["shortName"],
                                subQuery: false
                            }
                        ],
                        required: true,
                        subQuery: false
                    }
                ],
                where: demoWhere
            });

            const response: APIResponse<ReplayResponse[]> = {
                totalResults: result.count,
                page,
                resultsPerPage: limit,
                filters,
                sorts: sort,
                data: result.rows as unknown as ReplayResponse[]
            };

            res.json(response);
        });
    }

    protected replay() {
        this.app.get("/replays/:replayId", async(req, res, next) => {
            const replay = await this.barDb.schema.demo.findByPk(req.params.replayId, {
                include: [
                    {
                        model: this.barDb.schema.map,
                        subQuery: false
                    },
                    {
                        model: this.barDb.schema.allyTeam,
                        include: [this.barDb.schema.player, this.barDb.schema.ai],
                        separate: true,
                        order: [["allyTeamId", "ASC"]],
                        subQuery: false
                    },
                    {
                        model: this.barDb.schema.spectator,
                        subQuery: false
                    }
                ]
            });

            if (replay === null) {
                next("Replay not found");
                return;
            }

            res.json(replay);
        });
    }

    protected players() {
        this.app.get("/players", async(req, res) => {
            res.send("players");
        });

        this.app.get("/players/:playerId", async(req, res) => {
            res.send(`player: ${req.params.playerId}`);
        });
    }

    protected maps() {
        this.app.get("/maps", async(req, res) => {
            res.send("maps");
        });

        this.app.get("/maps/:mapId", async(req, res) => {
            res.send(`map: ${req.params.mapId}`);
        });
    }

    protected leaderboards() {
        this.app.get("/leaderboards", async(req, res) => {
            res.json(this.leaderboardService.leaderboards);
        });
    }

    protected battles() {
        this.app.get("/battles", async(req, res) => {
            res.json(this.lobbyService.activeBattles);
        });
    }

    protected users() {
        this.app.get("/users", async(req, res) => {
            const result = await this.barDb.schema.user.findAll({
                attributes: ["username", "countryCode"]
            });

            return res.json(result);
        });
    }

    protected cachedUsers() {
        this.app.get("/cached-users", async(req, res) => {
            const cachedUsers = await this.barDb.getUsersFromMemory();

            res.setHeader("Content-Type", "application/json");

            return res.end(cachedUsers);
        });
    }

    protected cachedMaps() {
        this.app.get("/cached-maps", async(req, res) => {
            const cachedMaps = await this.barDb.getMapsFromMemory();

            res.setHeader("Content-Type", "application/json");

            return res.end(cachedMaps);
        });
    }

    protected test() {
        this.app.get("/test", async(req, res, next) => {
            throw new Error("test");
        });
    }

    protected async getPlayerDemoIds(players: string[]) {
        const foundDemos = await this.barDb.schema.demo.findAll({
            attributes: ["id", [Sequelize.fn("ARRAY_AGG", Sequelize.col("name")), "players"]],
            include: [{
                model: this.barDb.schema.allyTeam,
                attributes: [],
                include: [{
                    model: this.barDb.schema.player,
                    attributes: [],
                    right: true,
                    where: {
                        name: {
                            [Op.in]: players
                        }
                    }
                }],
                required: true
            }],
            group: ["Demo.id"],
            having: Sequelize.literal(`COUNT(*) = ${players.length}`)
        });

        const foundDemoIds = foundDemos.map(demo => demo.id);

        return foundDemoIds;
    }

    protected async getTrueSkillDemoIds(trueSkillMin: number, trueSkillMax: number) {
        const foundDemos = await this.barDb.schema.demo.findAll({
            attributes: ["id"],
            include: [{
                model: this.barDb.schema.allyTeam,
                attributes: [],
                include: [{
                    model: this.barDb.schema.player,
                    attributes: []
                }]
            }],
            group: ["Demo.id"],
            having: Sequelize.literal(`COUNT(*) = COUNT(CASE WHEN "AllyTeams->Players"."trueSkill" BETWEEN ${trueSkillMin} AND ${trueSkillMax} THEN 1 END)`)
        });

        const foundDemoIds = foundDemos.map(demo => demo.id);

        return foundDemoIds;
    }
}

export default apiModule;
