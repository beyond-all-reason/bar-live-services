import { Writable } from "jaz-ts-utils";
import _ from "lodash";
import { defaultMapFilters, defaultMapSorts, MapFilters, Maprequest } from "../../model/api/maps";
import { defaultPaginatedRequest } from "../../model/api/paginated-request";

export function parseMapsRequestQuery(query: { [key: string]: string }) : Required<Maprequest> {
    const filters = parseMapFilters(query);

    const sorts: Writable<typeof defaultMapSorts> = _.clone(defaultMapSorts);
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

export function parseMapFilters(query: { [key: string]: string }) : Partial<MapFilters> {
    const filters: Partial<MapFilters> = _.cloneDeep(defaultMapFilters);

    for (const key in query) {
        try {
            const filterKey = key as keyof MapFilters;
            const strVal = query[key];

            if (strVal !== "any") {
                switch (filterKey) {
                }
            } else {
                delete filters[filterKey];
            }
        } catch (err) {
            console.log("Error parsing filters:", query);
            return filters;
        }
    }

    return filters;
}
