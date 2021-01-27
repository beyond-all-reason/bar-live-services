import { Module } from "@nuxt/types";
import express from "express";
import { servicesConfig } from "~/services-config-example";
import { LeaderboardService } from "~/services/leaderboard-service";
import { LobbyService } from "~/services/lobby-service";

const api: Module = async function () {
    //const leaderboardService = await new LeaderboardService(servicesConfig.leaderboards).init();
    //const lobbyService = await new LobbyService(servicesConfig.lobby).init();

    const app = express();

    console.log("express app created");

    app.use(express.json());
    app.all('/test', (req, res) => {
        res.json({ data: 'data' })
    })

    this.addServerMiddleware(app);
}

export default api;