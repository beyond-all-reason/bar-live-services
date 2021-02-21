import { Optionals } from "jaz-ts-utils";

export interface PaginatedRequest<F extends Filters = {}, S extends Sort = {}> {
    page?: number;
    limit?: number;
    filters?: F;
    sort?: S;
}

export const defaultPaginatedRequest: Optionals<PaginatedRequest> = {
    page: 1,
    limit: 20,
    filters: {},
    sort: {}
};

export type Filters = { [key: string]: boolean; };

export type Sort = { [key: string]: "asc" | "desc" };

export type SortType = "asc" | "desc";