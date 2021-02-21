export interface PaginatedResponse<T extends any> {
    totalResults: number;
    resultsPerPage: number;
    page: number;
    data: T;
}