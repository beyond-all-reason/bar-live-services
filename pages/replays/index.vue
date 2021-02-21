<template>
    <div>
        <h1 class="page-title">
            Replays
        </h1>
        <div class="filters">
            <v-chip-group v-model="filters" multiple @change="changeFilters">
                <v-chip label :ripple="false" value="duel">
                    Duel
                </v-chip>
                <v-chip label :ripple="false" value="team">
                    Team
                </v-chip>
                <v-chip label :ripple="false" value="ffa">
                    FFA
                </v-chip>
                <v-chip label :ripple="false" value="bots">
                    Bots
                </v-chip>
                <v-chip label :ripple="false" value="endedNormally">
                    Ended Normally
                </v-chip>
            </v-chip-group>
        </div>
        <div class="replays">
            <ReplayPreview v-for="(replay, index) in replays" :key="index" :replay="replay" />
        </div>
        <v-pagination v-model="page" :length="pageCount" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { Demo } from "bar-db/dist/model/demo";
import _ from "lodash";
import { Component, Vue } from "nuxt-property-decorator";

import { APIResponse } from "~/model/api/api-response";
import { ReplayFilters, defaultReplayFilters, ReplaySorts } from "~/model/api/replays";

@Component({
    head: { title: "BAR - Replays" },
    watch: {
        "$route.query": "$fetch"
    }
})
export default class Page extends Vue {
    replays: Demo[] = [];
    page: number = 1;
    pageCount: number = 0;
    filters: (keyof typeof defaultReplayFilters)[] = [];

    async fetch (): Promise<any> {
        const searchParams = new URLSearchParams(this.$route.query as {});
        const response = await this.$http.$get("replays", { searchParams }) as APIResponse<Demo[], ReplayFilters, ReplaySorts>;
        this.replays = response.data;
        this.page = response.page;
        this.pageCount = Math.ceil(response.totalResults / response.resultsPerPage);
        const filters = Object.keys(response.filters).filter(key => response.filters[key] === true);
        this.filters = filters;
    }

    async changePage (page: number) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: page.toString() } });
    }

    changeFilters () {
        const currentQuery = _.clone(this.$route.query);
        const query: { [key: string]: string } = {};
        for (const filterKey in defaultReplayFilters) {
            delete currentQuery[filterKey];
            if (this.filters.includes(filterKey) && defaultReplayFilters[filterKey] === false) {
                query[filterKey] = "true";
            } else if (!this.filters.includes(filterKey) && defaultReplayFilters[filterKey] === true) {
                query[filterKey] = "false";
            }
        }
        this.$router.push({ path: this.$route.path, query: { ...currentQuery, ...query } });
    }
}
</script>

<style lang="scss" scoped>
.filters {
    display: flex;
    justify-content: center;
}
.replays {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
