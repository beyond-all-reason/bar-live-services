import { ServicesConfig } from "./services/services-config";
import { createFileLogger } from "./utils/logger";

export const servicesConfig: ServicesConfig = {
    lobby: {
        host: "road-flag.bnr.la",
        port: 8200,
        username: "lobbyUsername",
        password: "lobbyPassword",
        verbose: true,
        logger: createFileLogger("lobby-bot")
    },
    leaderboards: {
        host: "112.213.34.51",
        port: 8300,
        username: "xmlrpcUsername",
        password: "xmlrpcPassword",
        leaderboards: ["Duel", "Team", "FFA"],
        pollInterval: 60000,
        verbose: true
    },
    bardb: {
        dbHost: "localhost",
        dbPort: 5432,
        dbUsername: "postgres",
        dbPassword: "pgpassword",
        createSchemaDiagram: true,
        mapPath: "C:/Users/tim/Repos/bar-db/maps/unprocessed",
        demoPath: "C:/Users/tim/Repos/bar-db/demos/unprocessed",
        verbose: true
    }
};
