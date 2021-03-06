import { SpringLobbyProtocolClient, SpringLobbyProtocolClientConfig } from "sluts";
import * as net from "net";
import { Signal } from "jaz-ts-utils";
import { Database } from "bar-db";
import { createFileLogger } from "../utils/logger";
import { Battle } from "../model/battle";
import { Player } from "../model/player";
import { Service } from "../services/service";

export interface LobbyServiceConfig extends SpringLobbyProtocolClientConfig {}

export type Battles = { [battleId: number]: Battle<{ [username: string]: Player }> };
export type Players = { [key: string]: Player };

export class LobbyService extends Service {
    public config: LobbyServiceConfig;
    public lobbyClient: SpringLobbyProtocolClient;
    public onBattleUpdate: Signal = new Signal();
    public onPlayerUpdate: Signal = new Signal();
    public battles: Battles = {};
    public players: Players = {};
    public activeBattles: Battle<Player[]>[] = [];
    public db: Database;

    constructor (config: LobbyServiceConfig, db: Database) {
        super();

        this.config = { ...config, logger: createFileLogger("lobby-bot") };

        this.db = db;

        this.lobbyClient = new SpringLobbyProtocolClient(this.config);

        process.on("SIGINT", async () => {
            await this.lobbyClient.disconnect();

            process.exit();
        });

        this.onBattleUpdate.add(() => this.updateActiveBattles());
    }

    public async init () {
        this.lobbyClient.onResponse("ADDUSER").add((data) => {
            this.players[data.userName] = {
                username: data.userName,
                userId: data.userId,
                country: data.country
            };

            this.onPlayerUpdate.dispatch();
        });

        this.lobbyClient.onResponse("REMOVEUSER").add((data) => {
            const player = this.players[data.userName];
            if (player.battleId) {
                delete this.battles[player.battleId].players[player.username];
            }
            delete this.players[data.userName];

            this.onPlayerUpdate.dispatch();
        });

        this.lobbyClient.onResponse("CLIENTSTATUS").add((data) => {
            const player = this.players[data.userName];
            player.status = data.status;

            this.onPlayerUpdate.dispatch();
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

            this.onBattleUpdate.dispatch();
        });

        this.lobbyClient.onResponse("BATTLECLOSED").add((data) => {
            delete this.battles[data.battleId];

            this.onBattleUpdate.dispatch();
        });

        this.lobbyClient.onResponse("UPDATEBATTLEINFO").add((data) => {
            const battle = this.battles[data.battleId];
            battle.locked = data.locked;
            battle.spectators = data.spectatorCount;
            battle.mapHash = data.mapHash;
            battle.map = data.mapName;

            this.onBattleUpdate.dispatch();
        });

        this.lobbyClient.onResponse("JOINEDBATTLE").add((data) => {
            const player = this.players[data.userName];
            const battle = this.battles[data.battleId];

            battle.players[player.username] = player;

            this.onBattleUpdate.dispatch();
        });

        this.lobbyClient.onResponse("LEFTBATTLE").add((data) => {
            const player = this.players[data.userName];
            const battle = this.battles[data.battleId];

            delete battle.players[player.username];

            this.onBattleUpdate.dispatch();
        });

        await this.lobbyClient.connect();

        return super.init();
    }

    protected updateActiveBattles () {
        const allBattles: Battle[] = Object.values(this.battles).map((battle) => {
            const playersObj = battle.players;
            const playersArr = Object.values(playersObj);
            return {
                ...battle,
                players: playersArr
            };
        });

        let activeBattles = allBattles.filter(battle => battle.players.length > 0);
        activeBattles.forEach(async (battle, i) => {
            const map = await this.db.schema.map.findOne({
                where: { scriptName: battle.map },
                attributes: ["fileName"]
            });

            battle.mapFileName = map?.fileName;
        });

        activeBattles = activeBattles.sort((a, b) => b.players.length - a.players.length);

        const passwordedOrLocked: Battle[] = [];
        activeBattles.forEach((battle, i) => {
            if (battle.passworded || battle.locked) {
                const battle = activeBattles.splice(i, 1)[0];
                passwordedOrLocked.unshift(battle);
            }
        });
        activeBattles.push(...passwordedOrLocked);

        this.activeBattles = activeBattles;
    }

    protected getSpadsInfo(ip: string, port: number) {
        return new Promise(resolve => {
            const socket = new net.Socket();
            socket.on("connect", () => {
                socket.write("getGameStatus");
            });
        });
    }
}
