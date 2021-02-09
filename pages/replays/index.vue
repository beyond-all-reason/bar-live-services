<template>
    <div>
        <h1 class="page-title">
            Replays
        </h1>
        <div class="replays">
            <ReplayPreview v-for="(replay, index) in replays" :key="index" :replay="replay" />
        </div>
        <v-pagination
            v-model="page"
            dark
            :length="pageCount"
            :total-visible="10"
            :test="page"
            @input="changePage"
        />
    </div>
</template>

<script lang="ts">
import { Demo } from "bar-db/dist/model/demo";
import { Component, Vue } from "nuxt-property-decorator";

import { APIResponse } from "~/model/api/api-response";

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

    async fetch (): Promise<any> {
        const searchParams = new URLSearchParams(this.$route.query as {});
        const response = await this.$http.$get("replays", { searchParams }) as APIResponse<Demo[]>;
        this.replays = response.data;
        this.page = response.page;
        this.pageCount = Math.ceil(response.totalResults / response.resultsPerPage);
    }

    async changePage (page: number) {
        this.$router.push({ path: this.$route.path, query: { page: page.toString() } });
    }
}
</script>

<style lang="scss" scoped>
.replays {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
