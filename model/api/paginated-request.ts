import { Optionals } from "jaz-ts-utils";

export interface PaginatedRequest<F extends any = {}, S extends Sort = {}> {
    page?: number;
    limit?: number;
    filters?: F;
    sort?: S;
}

export const defaultPaginatedRequest: Optionals<PaginatedRequest> = {
    page: 1,
    limit: 24,
    filters: {},
    sort: {}
};

export type FilterType = string | string[] | number | number[] | boolean | null | undefined;
// export type Filters = { [key: string]: FilterType };
// type PartialRecord<K extends string, T> = { [P in K]?: T; };
// export type PartialFilter<K extends string> = { [P in K]?: FilterType; };

export type SortType = "asc" | "desc";
export type Sort = Record<string, SortType>;
