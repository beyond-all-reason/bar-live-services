<template>
    <div>
        <h1 class="page-title">Replays</h1>
        
        <div class="filters">

            <Options v-model="filters.endedNormally">
                <template v-slot:title>
                    Ended Normally <v-icon class="small">mdi-checkbox-marked-circle</v-icon>
                </template>
                <Option :value="false" bg-color="#b83e3e" text-color="#fff">
                    <v-icon color="#b13b3b">mdi-close-thick</v-icon>
                </Option>
                <Option :value="true" bg-color="#70a232" text-color="#fff">
                    <v-icon color="#91b64d">mdi-check-bold</v-icon>
                </Option>
            </Options>

            <Options v-model="filters.hasBots">
                <template v-slot:title>
                    Has Bots <v-icon class="small">mdi-robot</v-icon>
                </template>
                <Option :value="false" bg-color="#b83e3e" text-color="#fff">
                    <v-icon color="#b13b3b">mdi-close-thick</v-icon>
                </Option>
                <Option :value="true" bg-color="#70a232" text-color="#fff">
                    <v-icon color="#91b64d">mdi-check-bold</v-icon>
                </Option>
            </Options>

            <MultiOptions v-model="filters.preset">
                <template v-slot:title>
                    Preset <v-icon class="small">mdi-account-cog</v-icon>
                </template>
                <Option value="duel">Duel</Option>
                <Option value="team">Team</Option>
                <Option value="ffa">FFA</Option>
            </MultiOptions>

            <DateFilter v-model="filters.date"/>

            <Range v-model="filters.durationRangeMins" :min="0" :max="120">
                <template v-slot:title>
                    Duration in minutes <v-icon class="small">mdi-clock</v-icon>
                </template>
            </Range>

            <Range v-model="filters.tsRange" :min="0" :max="50">
                <template v-slot:title>
                    TrueSkill Range <v-icon class="small">mdi-chevron-triple-up</v-icon>
                </template>
            </Range>

            <PlayerFilter v-model="filters.players" />

            <MapFilter v-model="filters.maps" />
        </div>
        
        <div class="replays-container">
            <div class="toolbar">
                <div class="left"></div>
                <div class="total-results">
                    Found {{ totalResults }} replays in {{ timeTaken }}ms.
                </div>
                <div class="spoilers noselect right">
                    <label for="chkSpoilers">Spoil Results</label>
                    <input type="checkbox" id="chkSpoilers" v-model="spoilResults" @change="spoilResultsChanged">
                </div>
            </div>
            <div class="replays">
                <ReplayPreview v-for="(replay, index) in replays" :key="index" :replay="replay" :spoilResults="spoilResults" />
            </div>
        </div>
        <v-pagination v-model="filters.page" :length="Math.ceil(totalResults / filters.limit)" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { DBSchema } from "bar-db/dist/model/db";
import { Component, Vue } from "nuxt-property-decorator";
import { cloneDeep } from "lodash";
import _ from "lodash";
import { coerceObjectFactory } from "~/utils/coerce-object";
import { stringifyQuery } from "~/utils/stringify-query";
import { replaysQuerySchema } from "bar-db/dist/model/rest-api/replays";
import { CancelTokenSource } from "axios";

const coerceObject = coerceObjectFactory(replaysQuerySchema);

@Component({
    head: { title: "BAR - Replays" },
    watch: {
        filters: {
            handler(this: ReplaysPage) { this.fetchReplays() },
            deep: true
        }
    }
})
export default class ReplaysPage extends Vue {
    totalResults = 0;
    replays: DBSchema.Demo.Schema[] = [];
    timeTaken = 0;
    spoilResults = false;
    cancelSourceToken?: CancelTokenSource;
    waitingForResponse = false;
    lastQuery: string = "";

    filters: {
        [key: string]: any;
        page?: number,
        limit?: number;
        preset?: string[];
        hasBots?: boolean;
        endedNormally?: boolean;
        date?: [string] | [string, string];
        durationRangeMins?: [number, number];
        tsRange?: [number, number];
        players?: string[];
        maps?: string[];
        reported?: boolean;
    } = {
        page: 1,
        limit: 24,
        preset: undefined,
        hasBots: false,
        endedNormally: true,
        date: undefined,
        durationRangeMins: undefined,
        tsRange: undefined,
        players: undefined,
        maps: undefined,
        reported: undefined
    };

    async fetchReplays() {
        const query = stringifyQuery(this.filters);
        this.$router.push({ path: this.$route.path, query: this.filters });

        if (this.waitingForResponse && this.cancelSourceToken) {
            this.cancelSourceToken.cancel();
        }
        
        try {
            this.cancelSourceToken = this.$axios.CancelToken.source();
            const beforeTime = Date.now();
            this.waitingForResponse = true;
            const { totalResults, page, limit, data } = await this.$axios.$get(`replays${query}`, { cancelToken: this.cancelSourceToken.token }) as any;
            this.waitingForResponse = false;
            this.timeTaken = Date.now() - beforeTime;
            this.totalResults = totalResults;
            this.replays = data;
        } catch (err) {
            if (this.$axios.isCancel(err)) {
            } else {
                console.error(err);
            }
        }
    }

    async changePage(page: number) {
        window.scrollTo(0, 0);
    }

    beforeMount() {
        this.spoilResults = localStorage.getItem("spoilResults") === "true";

        const obj = coerceObject(this.$route.query);
        this.filters = Object.assign({}, this.filters, obj);
    }

    spoilResultsChanged() {
        localStorage.setItem("spoilResults", String(this.spoilResults));
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
.replays-container {
    margin-bottom: 10px;
}
.replays {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    gap: 30px;
}
.range {
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
.spoilers {
    display: flex;
    align-items: center;
    column-gap: 3px;
}
</style>
