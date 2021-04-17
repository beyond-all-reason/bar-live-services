<template>
    <div>
        <h1 class="page-title">
            Replays
        </h1>
        <div class="filters">
            <Options v-model="filters.preset" multiple required>
                <template v-slot:title>Preset <v-icon>mdi-account</v-icon></template>
                <Option value="duel">Duel</Option>
                <Option value="team">Team</Option>
                <Option value="ffa">FFA</Option>
            </Options>
            <Options v-model="filters.hasBots">
                <template v-slot:title>Has Bots <v-icon>mdi-robot</v-icon></template>
                <Option :value="false" bgColor="#b83e3e" textColor="#fff"><v-icon color="#b13b3b">mdi-close-thick</v-icon></Option>
                <Option :value="null"><v-icon>mdi-minus-thick</v-icon></Option>
                <Option :value="true" bgColor="#70a232" textColor="#fff"><v-icon color="#91b64d">mdi-check-bold</v-icon></Option>
            </Options>
            <Options v-model="filters.endedNormally">
                <template v-slot:title>Ended Normally <v-icon>mdi-checkbox-marked-circle</v-icon></template>
                <Option :value="false" bgColor="#b83e3e" textColor="#fff"><v-icon color="#b13b3b">mdi-close-thick</v-icon></Option>
                <Option :value="null"><v-icon>mdi-minus-thick</v-icon></Option>
                <Option :value="true" bgColor="#70a232" textColor="#fff"><v-icon color="#91b64d">mdi-check-bold</v-icon></Option>
            </Options>
            <div class="flex-col tsRange">
                <label>TrueSkill Range</label>
                <v-range-slider v-model="filters.tsRange" :min="0" :max="50" thumb-label="always" tick-size="1" hide-details="true"></v-range-slider>
            </div>
            <TextFilter/>
        </div>
        <div class="total-results">
            Found {{ totalResults }} replays in {{ timeTaken }}ms.
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

export type NullableBoolean = boolean | null;

export interface Filters {
    preset: Array<"duel" | "team" | "ffa">;
    hasBots: NullableBoolean;
    endedNormally: NullableBoolean;
    tsRange: [number, number];
}

@Component({
    head: { title: "BAR - Replays" },
    watch: {
        "$route.query": "$fetch",
        //"hasBots": "changeFilters"
    }
})
export default class Page extends Vue {
    totalResults = 0;
    page = 1;
    pageCount = 0;
    replays: Demo[] = [];
    timeTaken = 0;
    filters: Filters = {
        preset: ["duel", "team", "ffa"],
        hasBots: null,
        endedNormally: true,
        tsRange: [0, 50]
    }

    async fetch (): Promise<any> {
        const beforeTime = Date.now();
        const searchParams = new URLSearchParams(this.$route.query as {});
        const response = await this.$http.$get("replays", { searchParams }) as APIResponse<Demo[], ReplayFilters, ReplaySorts>;
        this.timeTaken = Date.now() - beforeTime;
        this.totalResults = response.totalResults;
        this.page = response.page;
        this.pageCount = Math.ceil(response.totalResults / response.resultsPerPage);
        //this.filters = Object.keys(response.filters).filter(key => response.filters[key] === true);
        this.replays = response.data;
    }

    async changePage (page: number) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: page.toString() } });
    }

    changeFilters () {
        const currentQuery = _.clone(this.$route.query);
        const query: { [key: string]: string | undefined } = {
            test: undefined,
            fish: "ok"
        };
        console.log(query);

        // const query: { [key: string]: string } = {};
        // for (const filterKey in defaultReplayFilters) {
        //     delete currentQuery[filterKey];
        //     if (this.filters.includes(filterKey) && defaultReplayFilters[filterKey] === false) {
        //         query[filterKey] = "true";
        //     } else if (!this.filters.includes(filterKey) && defaultReplayFilters[filterKey] === true) {
        //         query[filterKey] = "false";
        //     }
        // }
        // this.$router.push({ path: this.$route.path, query: { ...currentQuery, ...query } });
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
.replays {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.total-results {
    font-size: 11px;
    margin-top: 8px;
    text-align: center;
}
.tsRange {
    width: 200px;
    border: 1px solid #4a4a4a;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.05);
    label {
        width: 100%;
        padding: 2px 7px;
        text-align: center;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: solid 1px #4a4a4a;
    }
}
</style>
