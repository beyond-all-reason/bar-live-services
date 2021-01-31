import { SpringLobbyProtocolClient, SpringLobbyProtocolClientConfig } from "sluts";

import { Battle } from "../model/battle";
import { Player } from "../model/player";
import { Service } from "../services/service";

export interface LobbyServiceConfig extends SpringLobbyProtocolClientConfig {}

export type Battles = { [key: number]: Battle<{ [username: string]: Player }> };
export type Players = { [key: string]: Player };

export class LobbyService extends Service {
    public config: LobbyServiceConfig;
    public lobbyClient: SpringLobbyProtocolClient;

    protected battles: Battles = {};
    protected players: Players = {};

    constructor (config: LobbyServiceConfig) {
        super();

        this.config = config;

        this.lobbyClient = new SpringLobbyProtocolClient(this.config);

        process.on("SIGINT", async () => {
            await this.lobbyClient.disconnect();

            process.exit();
        });
    }

    public async init () {
        this.lobbyClient.onResponse("ADDUSER").add((data) => {
            this.players[data.userName] = {
                username: data.userName,
                userId: data.userId,
                country: data.country
            };
        });

        this.lobbyClient.onResponse("REMOVEUSER").add((data) => {
            const player = this.players[data.userName];
            if (player.battleId) {
                delete this.battles[player.battleId].players[player.username];
            }
            delete this.players[data.userName];
        });

        this.lobbyClient.onResponse("CLIENTSTATUS").add((data) => {
            const player = this.players[data.userName];
            player.status = data.status;
        });

        this.lobbyClient.onResponse("BATTLEOPENED").add((data) => {
            this.battles[data.battleId] = {
                battleId: data.battleId,
                founder: this.players[data.founder],
                game: data.gameName,
                ip: data.ip,
                port: data.port,
                locked: false,
                map: data.map,
                mapHash: data.mapHash,
                maxPlayers: data.maxPlayers,
                passworded: data.passworded,
                rank: data.rank,
                title: data.title,
                players: {},
                spectators: 0
            };

            const founder = this.players[data.founder];
            if (founder && founder.status && !founder.status.bot) {
                this.battles[data.battleId].players[founder.username] = founder;
            }
        });

        this.lobbyClient.onResponse("BATTLECLOSED").add((data) => {
            delete this.battles[data.battleId];
        });

        this.lobbyClient.onResponse("UPDATEBATTLEINFO").add((data) => {
            const battle = this.battles[data.battleId];
            battle.locked = data.locked;
            battle.spectators = data.spectatorCount;
            battle.mapHash = data.mapHash;
            battle.map = data.mapName;
        });

        this.lobbyClient.onResponse("JOINEDBATTLE").add((data) => {
            const player = this.players[data.userName];
            const battle = this.battles[data.battleId];

            battle.players[player.username] = player;
        });

        this.lobbyClient.onResponse("LEFTBATTLE").add((data) => {
            const player = this.players[data.userName];
            const battle = this.battles[data.battleId];

            delete battle.players[player.username];
        });

        await this.lobbyClient.connect();

        return super.init();
    }

    public getActiveBattles () : Battle[] {
        const allBattles: Battle[] = Object.values(this.battles).map((battle) => {
            const playersObj = battle.players;
            const playersArr = Object.values(playersObj);
            return {
                ...battle,
                players: playersArr
            };
        });
        const activeBattles = allBattles.filter(battle => battle.players.length > 0);
        return activeBattles;
    }
}
