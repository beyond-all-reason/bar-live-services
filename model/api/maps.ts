import { Demo, Spectator, AllyTeam, AI, Player, Map } from "bar-db";
import { PaginatedRequest, Sort, SortType } from "~/model/api/paginated-request";

export interface Maprequest extends PaginatedRequest<Partial<MapFilters>, MapSorts> {
}

export interface MapFilters {
}

export const defaultMapFilters: Partial<Readonly<MapFilters>> = {

};

export interface MapSorts extends Sort {

}

export const defaultMapSorts: Readonly<MapSorts> = {

};

export interface MapResponse extends Map {
}