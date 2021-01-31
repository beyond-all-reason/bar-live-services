<template>
    <div>
        Player
    </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types/app';
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
    async asyncData({ store, $http, params }: Context): Promise<any> {
        
    }
}
</script>

<style lang="scss" scoped>

</style>