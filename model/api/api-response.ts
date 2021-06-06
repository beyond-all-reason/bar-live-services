import { Sort } from "~/model/api/paginated-request";

export interface APIResponse<T extends any, F extends any = {}, S extends Sort = {}> {
    totalResults: number;
    resultsPerPage: number;
    page: number;
    filters: F;
    sorts: S;
    data: T;
}
