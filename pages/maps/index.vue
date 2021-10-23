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
import { coerceObjectFactory } from "~/utils/coerce-object";
import { stringifyQuery } from "~/utils/stringify-query";
import { paginationQuerySchema } from "bar-db/dist/model/rest-api/pagination";

const coerceObject = coerceObjectFactory(paginationQuerySchema);

@Component({
    head: { title: "BAR - Maps" },
    watch: {
        filters: {
            handler(this: MapsPage) {
                if (!this.ready) {
                    return;
                }
                this.fetchMaps();
            },
            deep: true
        }
    }
})
export default class MapsPage extends Vue {
    totalResults = 0;
    maps: DBSchema.SpringMap.Schema[] = [];
    timeTaken = 0;
    ready = false;
    filters: {
        [key: string]: any;
        page: number;
        limit: number;
    } = {
        page: 1,
        limit: 24,
    };

    async fetch(): Promise<any> {
        const beforeTime = Date.now();
        const { totalResults, page, limit, data } = await this.$axios.$get("maps") as any;
        this.timeTaken = Date.now() - beforeTime;
        this.totalResults = totalResults;
        this.filters.limit = limit;
        this.maps = data;
    }

    async fetchMaps() {
        const query = stringifyQuery(this.filters);
        this.$router.push({ path: this.$route.path, query: this.filters });
        
        try {
            const beforeTime = Date.now();
            const { totalResults, page, limit, data } = await this.$axios.$get(`maps${query}`) as any;
            this.timeTaken = Date.now() - beforeTime;
            this.totalResults = totalResults;
            this.maps = data;
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
        const obj = coerceObject(this.$route.query);
        Object.assign(this.filters, obj);
    }

    mounted() {
        this.ready = true;
        this.fetchMaps();
    }
}
</script>

<style lang="scss" scoped>

</style>
