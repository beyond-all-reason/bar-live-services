import { Module } from "@nuxt/types";
import WebSocket from "ws";

import { LeaderboardService } from "../services/leaderboard-service";
import { LobbyService } from "../services/lobby-service";
import { servicesConfig } from "../services-config";

interface PreparedContext {
    modern:boolean
    req: Request;
    res: Response;
    runtimeConfig:{
        private: { [key: string]: any };
        public: { [key: string]: any };
    };
    spa: any;
    target: "server" | "client";
    url: string;
}

const initModule: Module = async function () {
    const leaderboardService = await new LeaderboardService(servicesConfig.leaderboards).init();
    const lobbyService = await new LobbyService(servicesConfig.lobby).init();

    this.nuxt.hook("vue-renderer:ssr:prepareContext", (preparedContext: PreparedContext) => {
        if (preparedContext.url === "/leaderboards") {
            preparedContext.runtimeConfig.public.leaderboards = leaderboardService.leaderboards;
        } else if (preparedContext.url === "/battles") {
            const battles = lobbyService.getActiveBattles();
            preparedContext.runtimeConfig.public.battles = battles;
        }
    });

    this.nuxt.hook("listen", () => {
        const wss = new WebSocket.Server({ port: 3001 });

        this.nuxt.hook("close", () => {
            wss.close();
        });

        setInterval(() => {
            const battles = JSON.stringify(lobbyService.getActiveBattles());
            wss.clients.forEach((client) => {
                client.send(battles);
            });
        }, 5000);
    });
};

export default initModule;
