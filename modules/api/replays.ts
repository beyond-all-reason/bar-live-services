import { FilterType } from "~/model/api/paginated-request";
import { parseStringArray, parseNumberArray, parseBoolean } from "../../model/api/query-parser";
import { ReplayFilters } from "../../model/api/replays";

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
                default: {
                    console.log(`Unhandled filter: ${filterKey}`);
                }
            }
        }
    }

    return filters;
}