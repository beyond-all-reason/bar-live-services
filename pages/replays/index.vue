<template>
    <div>
        <h1 class="page-title">Replays</h1>
        
        <div class="filters">

            <Options v-model="preset" multiple>
                <template v-slot:title>
                    Preset <v-icon class="small">mdi-account</v-icon>
                </template>
                <Option value="duel">Duel</Option>
                <Option value="team">Team</Option>
                <Option value="ffa">FFA</Option>
            </Options>

            <Options v-model="hasBots">
                <template v-slot:title>
                    Has Bots <v-icon class="small">mdi-robot</v-icon>
                </template>
                <Option :value="false" bg-color="#b83e3e" text-color="#fff">
                    <v-icon color="#b13b3b">mdi-close-thick</v-icon>
                </Option>
                <Option :value="undefined">
                    <v-icon>mdi-minus-thick</v-icon>
                </Option>
                <Option :value="true" bg-color="#70a232" text-color="#fff">
                    <v-icon color="#91b64d">mdi-check-bold</v-icon>
                </Option>
            </Options>

            <Options v-model="endedNormally">
                <template v-slot:title>
                    Ended Normally <v-icon class="small">mdi-checkbox-marked-circle</v-icon>
                </template>
                <Option :value="false" bg-color="#b83e3e" text-color="#fff">
                    <v-icon color="#b13b3b">mdi-close-thick</v-icon>
                </Option>
                <Option :value="undefined">
                    <v-icon>mdi-minus-thick</v-icon>
                </Option>
                <Option :value="true" bg-color="#70a232" text-color="#fff">
                    <v-icon color="#91b64d">mdi-check-bold</v-icon>
                </Option>
            </Options>

            <DateFilter v-model="date" />

            <div class="flex-col range">
                <label>Duration in minutes <v-icon class="small">mdi-clock</v-icon></label>
                <v-range-slider :value="durationRangeMins" :min="0" :max="120" thumb-label="always" tick-size="1" hide-details="true" />
            </div>

            <div class="flex-col range">
                <label>TrueSkill Range <v-icon class="small">mdi-chevron-triple-up</v-icon></label>
                <v-range-slider :value="tsRange" :min="0" :max="50" thumb-label="always" tick-size="1" hide-details="true" />
            </div>

            <PlayerFilter v-model="players" />

            <MapFilter v-model="maps" />
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
        <v-pagination v-model="page" :length="numOfPages" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { Demo } from "bar-db/dist/model/demo";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
    head: { title: "BAR - Replays" },
    watch: {
        "$route.query": "$fetch",
        filters: {
            handler(this: ReplaysPage) {
                
            },
            deep: true
        }
    }
})
export default class ReplaysPage extends Vue {
    totalResults = 0;
    page = 1;
    numOfPages = 0;
    replays: Demo[] = [];
    timeTaken = 0;
    spoilResults = false;

    preset?: string = "";
    hasBots?: boolean = false;
    endedNormally?: boolean = true;
    date?: [string, string] | [string] = [""]
    durationRangeMins?: [number, number] = [0, 120];
    tsRange?: [number, number] = [0, 50];
    players?: string[] = [];
    maps?: string[] = [];

    async fetch(): Promise<any> {
        const beforeTime = Date.now();
        const searchParams = new URLSearchParams(this.$route.query as {});
        const response = await this.$http.$get("replays", { searchParams }) as any;
        this.timeTaken = Date.now() - beforeTime;
        this.totalResults = response.totalResults;
        this.page = response.page;
        this.numOfPages = Math.ceil(response.totalResults / response.limit);
        this.replays = response.data;
    }

    async changePage(page: number) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: page.toString() } });
        window.scrollTo(0, 0);
    }

    beforeMount() {
        this.spoilResults = localStorage.getItem("spoilResults") === "true";
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
