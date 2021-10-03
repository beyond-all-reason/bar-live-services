<template>
    <div>
        <h1 class="page-title">
            Maps
        </h1>
        <div class="filters">
        </div>
        <div class="maps-container">
            <div class="toolbar">
                <div class="left"></div>
                <div class="total-results">
                    Found {{ totalResults }} maps in {{ timeTaken }}ms.
                </div>
            </div>
            <div class="maps">
                <MapPreview v-for="(map, index) in maps" :key="index" :map="map" />
            </div>
        </div>
        <v-pagination v-model="page" :length="pageCount" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { SpringMap } from "bar-db";
import { Component, Vue } from "nuxt-property-decorator";

import _ from "lodash";
import { APIResponse } from "~/model/api/api-response";
import { MapFilters, defaultMapFilters, MapSorts } from "~/model/api/maps";
import { parseMapFilters } from "~/modules/api/maps";

@Component({
    head: { title: "BAR - Maps" },
    watch: {
        "$route.query": "$fetch",
        filters: {
            handler(this: MapsPage) {
                this.updateFilters();
            },
            deep: true
        }
    }
})
export default class MapsPage extends Vue {
    totalResults = 0;
    page = 1;
    pageCount = 0;
    maps: SpringMap[] = [];
    timeTaken = 0;
    defaultFilters: Partial<MapFilters> = _.clone(defaultMapFilters);
    filters: Partial<MapFilters> = _.clone(defaultMapFilters);
    spoilResults = false;

    async fetch(): Promise<any> {
        const beforeTime = Date.now();
        const searchParams = new URLSearchParams(this.$route.query as {});
        const response = await this.$http.$get("maps", { searchParams }) as APIResponse<SpringMap[], MapFilters, MapSorts>;
        this.timeTaken = Date.now() - beforeTime;
        this.totalResults = response.totalResults;
        this.page = response.page;
        this.pageCount = Math.ceil(response.totalResults / response.resultsPerPage);
        this.maps = response.data;
    }

    async changePage(page: number) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: page.toString() } });
        window.scrollTo(0, 0);
    }

    updateFilters() {
        const query: { [key: string]: string } = {};
        for (const [key, val] of Object.entries(this.filters)) {
            const isDefaultVal = _.isEqual(defaultMapFilters[key as keyof MapFilters], val);

            if (isDefaultVal) {
                continue;
            }

            if (val === null) {
                query[key] = "null";
            } else if (val === undefined || (Array.isArray(val) && val.length === 0)) {
                query[key] = "any";
            } else {
                query[key] = encodeURI(String(val));
            }
        }

        this.$router.push({ query });
    }

    beforeMount() {
        const query = this.$route.query as { [key: string]: string };
        this.filters = parseMapFilters(query);
    }
}
</script>

<style lang="scss" scoped>
.filters {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & > * {
        margin: 5px;
    }
}
.maps-container {
    margin-bottom: 10px;
}
.maps {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    gap: 30px;
}
.toolbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    justify-items: end;
    margin-left: auto;
    margin-right: auto;
    padding: 5px 0;
    font-size: 11px;
    width: calc(100% - (100% - ((250px * 6) + (30px * 5))));
    @media (max-width: 1903px) {
        width: calc(100% - (100% - ((250px * 4) + (30px * 3))));
    }
    @media (max-width: 1263px) {
        width: calc(100% - (100% - ((250px * 3) + (30px * 2))));
    }
    @media (max-width: 839px) {
        width: calc(100% - (100% - ((250px * 2) + (30px * 1))));
    }
    @media (max-width: 559px) {
        width: calc(100% - (100% - ((250px * 1) + (30px * 0))));
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        & > * {
            display: flex;
            justify-content: center;
            width: 100%;
        }
    }
}
</style>
