import { Demo, Spectator, AllyTeam, AI, Player, Map } from "bar-db";
import { PaginatedRequest, Sort, SortType } from "~/model/api/paginated-request";

export interface ReplayRequest extends PaginatedRequest<Partial<ReplayFilters>, ReplaySorts> {
}

export interface ReplayFilters {
    preset: Array<"duel" | "team" | "ffa"> | null;
    endedNormally: boolean;
    hasBots: boolean | null;
    tsRange: [number, number];
    reported: boolean | null;
    players: string[];
    maps: string[];
    dateRange: string[];
    durationRangeMins: number[];
}

export const defaultReplayFilters: Partial<Readonly<ReplayFilters>> = {
    endedNormally: true,
    durationRangeMins: [0, 120],
    tsRange: [0, 50]
};

export interface ReplaySorts extends Sort {
    startTime: SortType;
}

export const defaultReplaySorts: Readonly<ReplaySorts> = {
    startTime: "desc"
};

export interface ReplayResponse extends Demo {
    AllyTeams: AllyTeamResponse[];
    Spectators: Spectator[];
    Map: Map;
}

export interface AllyTeamResponse extends AllyTeam {
    AIs: AI[];
    Players: Player[];
}
