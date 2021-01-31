<template>
    <div>
        Maps
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types/app";
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Page extends Vue {
    async asyncData ({ store, $http, params }: Context): Promise<any> {
        store.commit("setPageTitle", "Maps");
    }
}
</script>

<style lang="scss" scoped>

</style>
