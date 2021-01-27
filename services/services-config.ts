import { LeaderboardServiceConfig } from "./leaderboard-service";
import { LobbyServiceConfig } from "./lobby-service";

export interface ServicesConfig {
    lobby: LobbyServiceConfig,
    leaderboards: LeaderboardServiceConfig
}
