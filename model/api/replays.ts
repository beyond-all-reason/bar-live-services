import { Filters, PaginatedRequest, Sort, SortType } from "~/model/api/paginated-request";

export interface ReplayRequest extends PaginatedRequest<ReplayFilters, ReplaySorts> {
}

export interface ReplayFilters extends Filters {
    duel: boolean;
    team: boolean;
    ffa: boolean;
    bots: boolean;
    endedNormally: boolean;
    reported: boolean | undefined;
}

export const defaultReplayFilters: Readonly<ReplayFilters> = {
    duel: true,
    team: true,
    ffa: true,
    bots: false,
    endedNormally: true,
    reported: undefined
};

export interface ReplaySorts extends Sort {
    startTime: SortType;
}

export const defaultReplaySorts: Readonly<ReplaySorts> = {
    startTime: "desc"
};
