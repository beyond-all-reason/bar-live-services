<template>
    <div>
        Players
    </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types/app';
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
    async asyncData({ store, $http, params }: Context): Promise<any> {
        store.commit("setPageTitle", "Players");
    }
}
</script>

<style lang="scss" scoped>

</style>