import { PaginatedRequest } from "~/model/api/paginated-request";
import { ObjectChanges } from "bar-balance-changes";

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