<template>
    <v-app id="vApp" style="background: none" :class="`${this.$vuetify.breakpoint.name} ${this.inIframe ? 'in-iframe' : ''}`">
        <Navigation v-if="!inIframe" />
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class DefaultLayout extends Vue {
    get pageTitle () {
        return this.$store.state.pageTitle;
    }

    get inIframe() {
        return window.self !== window.top ? "in-iframe" : "";
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/main.scss";

.page-title {
    margin: 10px 0;
    font-size: 68px;
    font-weight: 700;
    text-align: center;
    .in-iframe & {
        display: none;
    }
}
.v-toolbar__content {
    padding: 0;
}
</style>
