<template>
    <div>
        <h1 class="page-title">
            Maps
        </h1>
        <div class="filters">
        </div>
        <div class="tiles-container">
            <div class="toolbar">
                <div class="left"></div>
                <div class="total-results">
                    Found {{ totalResults }} maps in {{ timeTaken }}ms.
                </div>
                <a class="json-api" target="_blank" :href="`${$axios.defaults.baseURL}/maps`">
                    <v-icon size="22">mdi-code-braces</v-icon>
                </a>
            </div>
            <div class="tiles">
                <MapPreview v-for="(map, index) in maps" :key="index" :map="map" />
            </div>
        </div>
        <v-pagination v-model="filters.page" :length="Math.ceil(totalResults / filters.limit)" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { DBSchema } from "bar-db/dist/model/db";
import { Component, Vue } from "nuxt-property-decorator";

import _ from "lodash";

@Component({
    head: { title: "BAR - Maps" },
    watch: {
        "$route.query": "$fetch"
    }
})
export default class MapsPage extends Vue {
    totalResults = 0;
    maps: DBSchema.SpringMap.Schema[] = [];
    timeTaken = 0;
    filters: {
        page: number;
        limit: number;
    } = {
        page: 1,
        limit: 10
    };

    async fetch(): Promise<any> {
        const beforeTime = Date.now();
        const { totalResults, page, limit, data } = await this.$axios.$get("maps") as any;
        this.timeTaken = Date.now() - beforeTime;
        this.totalResults = totalResults;
        this.filters.limit = limit;
        this.maps = data;
    }

    async changePage(page: number) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: page.toString() } });
        window.scrollTo(0, 0);
    }
}
</script>

<style lang="scss" scoped>

</style>
