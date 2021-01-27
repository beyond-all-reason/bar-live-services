<template>
    <div class="container">
        Replays
    </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types';
import Vue from 'vue'

export default Vue.extend({
    head() {
        return {
            title: "BAR - Replays"
        }
    },
    asyncData (context: Context) {
        context.store.commit("setPageTitle", "Replays");
    }
})
</script>

<style lang="scss" scoped>

</style>