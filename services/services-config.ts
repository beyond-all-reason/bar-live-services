import { DatabaseConfig } from "bar-db/dist/database";
import { LeaderboardServiceConfig } from "./leaderboard-service";
import { LobbyServiceConfig } from "./lobby-service";

export interface ServicesConfig {
    lobby: LobbyServiceConfig,
    leaderboards: LeaderboardServiceConfig
    bardb: DatabaseConfig & { mapPath: string, demoPath: string };
}
