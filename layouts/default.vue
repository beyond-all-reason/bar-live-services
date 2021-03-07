<template>
    <v-app id="vApp" :class="`${this.$vuetify.breakpoint.name} ${!this.$store.state.embedded ? 'not-embedded' : 'embedded'}`">
        <Navigation v-show="!this.$store.state.embedded" />
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import "iframe-resizer/js/iframeResizer.contentWindow";

@Component({
    watch: {
        $route (route) {
            (window as any).parentIFrame.sendMessage({
                params: route.params,
                query: route.query
            });
        }
    }
})
export default class DefaultLayout extends Vue {
    fetchOnServer () { return false; }

    async fetch () {
        if (process.browser) {
            this.$store.commit("setEmbedded", window.self !== window.top);
        }
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/main.scss";

.theme--dark.v-application {
    background: transparent !important;
    &.not-embedded {
        background: linear-gradient(180deg,rgba(0,0,0,.84),rgba(0,0,0,.84)),url("~assets/images/background.jpg") !important;
    }
}
.page-title {
    margin: 10px 0;
    font-size: 68px;
    font-weight: 700;
    text-align: center;
    display: none;
    .not-embedded & {
        display: block;
    }
}
.v-toolbar__content {
    padding: 0;
}
</style>
