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
    preset: ["duel", "ffa", "team"],
    endedNormally: true,
    tsRange: [0, 50],
    durationRangeMins: [0, 120],
    players: [],
    maps: [],
    dateRange: []
};

export interface ReplaySorts extends Sort {
    startTime: SortType;
}

export const defaultReplaySorts: Readonly<ReplaySorts> = {
    startTime: "desc"
};
