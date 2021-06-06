import { PaginatedRequest } from "~/model/api/paginated-request";
import { ObjectChanges } from "bar-balance-changes";
import { Optionals } from "jaz-ts-utils";

export interface BalanceChangesRequest extends PaginatedRequest {
}

export interface BalanceChangeResponse {
    sha: string;
    date: Date;
    message: string;
    url: string;
    author: {
        name: string;
        img: string;
        url: string;
    };
    changes: Array<{ unit: ObjectChanges }>;
}

export const defaultBalanceChangeRequest: Optionals<BalanceChangesRequest> = {
    page: 1,
    limit: 10,
    filters: {},
    sort: {}
};