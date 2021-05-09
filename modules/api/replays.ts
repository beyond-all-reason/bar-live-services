import { Writeable } from "jaz-ts-utils";
import _ from "lodash";
import { defaultPaginatedRequest } from "../../model/api/paginated-request";
import { parseStringArray, parseNumberArray, parseBoolean } from "../../model/api/query-parser";
import { defaultReplaySorts, ReplayFilters, ReplayRequest } from "../../model/api/replays";

export function parseReplaysRequestQuery(query: { [key: string]: string }) : Required<ReplayRequest> {
    const filters = parseReplayFilters(query);

    const sorts: Writeable<typeof defaultReplaySorts> = _.clone(defaultReplaySorts);
    for (const key in query) {
        const val = query[key];
        if (key in sorts) {
            sorts[key] = val === "asc" ? "asc" : "desc";
        }
    }

    return {
        page: parseInt(query.page) || defaultPaginatedRequest.page,
        limit: Math.min(parseInt(query.limit), defaultPaginatedRequest.limit) || defaultPaginatedRequest.limit,
        filters,
        sort: sorts
    };
}

export function parseReplayFilters(query: { [key: string]: string }, defaultFilters: Partial<ReplayFilters> = {}) : Partial<ReplayFilters> {
    const filters: Partial<ReplayFilters> = defaultFilters;

    for (const key in query) {
        const filterKey = key as keyof ReplayFilters;
        const strVal = query[key];

        if (strVal !== "any") {
            switch (filterKey) {
            case "preset": filters[filterKey] = strVal === "null" ? null : parseStringArray(strVal) as Array<"duel" | "team" | "ffa">; break;
            case "hasBots": filters[filterKey] = strVal === "null" ? null : parseBoolean(strVal); break;
            case "endedNormally": filters[filterKey] = parseBoolean(strVal); break;
            case "reported": filters[filterKey] = strVal === "null" ? null : parseBoolean(strVal); break;
            case "dateRange": filters[filterKey] = parseStringArray(strVal); break;
            case "durationRangeMins": filters[filterKey] = parseNumberArray(strVal) as [number, number]; break;
            case "tsRange": filters[filterKey] = parseNumberArray(strVal) as [number, number]; break;
            case "players": filters[filterKey] = parseStringArray(strVal); break;
            case "maps": filters[filterKey] = parseStringArray(strVal); break;
            }
        }
    }

    return filters;
}
