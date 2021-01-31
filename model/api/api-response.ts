import { AI } from "bar-db/dist/model/ai";
import { AllyTeam } from "bar-db/dist/model/ally-team";
import { Demo } from "bar-db/dist/model/demo";
import { Map } from "bar-db/dist/model/map";
import { Player } from "bar-db/dist/model/player";
import { Spectator } from "bar-db/dist/model/spectator";

export interface APIResponse<T extends any> {
    totalResults: number;
    resultsPerPage: number;
    page: number;
    data: T;
}

export interface ReplayResponse extends Demo {
    AllyTeams: AllyTeamResponse[];
    Spectators: Spectator[];
    Map: Map;
}

export interface AllyTeamResponse extends AllyTeam {
    AIs: AI[];
    Players: Player[];
}
