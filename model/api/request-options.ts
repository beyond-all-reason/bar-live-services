import { Optionals } from "jaz-ts-utils";

export interface APIRequestOptions {
    page?: number;
    limit?: number;
}

export const defaultApiRequestOptions: Optionals<APIRequestOptions> = {
    page: 1,
    limit: 50
};