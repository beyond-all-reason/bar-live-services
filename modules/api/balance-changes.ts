import { BalanceChangesRequest, defaultBalanceChangeRequest } from "../../model/api/balance-changes";

export function parseBalanceChangesRequestQuery(query: { [key: string]: string }) : Required<BalanceChangesRequest> {
    return {
        page: parseInt(query.page) || defaultBalanceChangeRequest.page,
        limit: Math.min(parseInt(query.limit), defaultBalanceChangeRequest.limit) || defaultBalanceChangeRequest.limit,
        filters: {},
        sort: {}
    };
}
