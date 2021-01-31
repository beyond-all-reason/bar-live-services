<template>
    <div class="container">
        <div class="replays">
            <ReplayPreview v-for="(replay, index) in replays" :key="index" :replay="replay" />
        </div>
    </div>
</template>

<script lang="ts">
import { Demo } from 'bar-db/dist/model/demo';
import { APIResponse } from '~/model/api/api-response';
import { Context } from '@nuxt/types/app';
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({
    head: { title: "BAR - Replays" }
})
export default class Page extends Vue {
    replays: Demo[] = [];

    async asyncData({ store, $http, params }: Context): Promise<any> {
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