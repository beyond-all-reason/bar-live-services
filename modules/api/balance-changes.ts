import { BalanceChangesRequest } from "~/model/api/balance-changes";
import { defaultPaginatedRequest } from "~/model/api/paginated-request";
import { ReplayRequest } from "~/model/api/replays";

export function parseReplaysRequestQuery(query: { [key: string]: string }) : Required<BalanceChangesRequest> {
    return {
        page: parseInt(query.page) || defaultPaginatedRequest.page,
        limit: Math.min(parseInt(query.limit), defaultPaginatedRequest.limit) || defaultPaginatedRequest.limit,
        filters: {},
        sort: {}
    };
}