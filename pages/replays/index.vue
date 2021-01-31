<template>
    <div class="container">
        <div class="replays">
            <ReplayPreview v-for="(replay, index) in replays" :key="index" :replay="replay" />
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types/app";
import { Demo } from "bar-db/dist/model/demo";
import { Component, Vue } from "nuxt-property-decorator";

import { APIResponse } from "~/model/api/api-response";

@Component({
    head: { title: "BAR - Replays" }
})
export default class Page extends Vue {
    replays: Demo[] = [];

    async asyncData ({ store, $http }: Context): Promise<any> {
        store.commit("setPageTitle", "Replays");

        const { data: replays } = await $http.$get("replays") as APIResponse<Demo[]>;
        return { replays };
    }
}
</script>

<style lang="scss" scoped>
.replays {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    //align-items: center;
}
</style>
